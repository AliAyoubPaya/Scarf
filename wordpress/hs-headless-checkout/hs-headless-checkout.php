<?php
/**
 * Plugin Name: HS Headless Checkout
 * Description: Short-lived, signed cart-session handoff from the HS storefront to WooCommerce hosted checkout.
 * Version: 0.1.0
 * Requires PHP: 8.1
 * Requires Plugins: woocommerce
 * WC requires at least: 10.7
 */
defined('ABSPATH') || exit;

use Automattic\WooCommerce\StoreApi\Utilities\CartTokenUtils;

add_action('hs_bridge_cleanup_claim', function ($key) { delete_option($key); });
function hs_bridge_claim($key) {
    if (!add_option($key, time(), '', false)) return false;
    wp_schedule_single_event(time() + 600, 'hs_bridge_cleanup_claim', array($key));
    return true;
}

add_action('rest_api_init', function () {
    register_rest_route('hs-store/v1', '/checkout-session', array(
        'methods' => 'POST',
        'permission_callback' => function (WP_REST_Request $request) {
            if (!defined('HS_CHECKOUT_SECRET') || strlen(HS_CHECKOUT_SECRET) < 32 || strlen($request->get_body()) > 16000) return false;
            $signature = $request->get_header('X-HS-Signature');
            $body = $request->get_json_params();
            return is_array($body) && isset($body['issuedAt']) && is_int($body['issuedAt'])
                && abs(time() - $body['issuedAt']) <= 60
                && hash_equals(hash_hmac('sha256', $request->get_body(), HS_CHECKOUT_SECRET), $signature);
        },
        'callback' => function (WP_REST_Request $request) {
            if (!defined('WC_VERSION') || version_compare(WC_VERSION, '10.7', '<') || !class_exists(CartTokenUtils::class)) return new WP_Error('hs_version', 'WooCommerce 10.7 or newer is required.', array('status' => 503));
            $body = $request->get_json_params();
            $cart_token = $body['cartToken'] ?? '';
            if (!is_string($cart_token) || !CartTokenUtils::validate_cart_token($cart_token)) return new WP_Error('hs_cart', 'Invalid cart session.', array('status' => 401));
            $payload = CartTokenUtils::get_cart_token_payload($cart_token);
            // Never transfer an authenticated WordPress user's session.
            if (!is_string($payload['user_id'] ?? null) || !str_starts_with($payload['user_id'], 't_')) return new WP_Error('hs_guest', 'A guest cart is required.', array('status' => 400));
            $nonce = $body['nonce'] ?? '';
            if (!is_string($nonce) || !preg_match('/^[a-f0-9-]{36}$/', $nonce) || !hs_bridge_claim('hs_nonce_' . hash('sha256', $nonce))) return new WP_Error('hs_replay', 'Request already used.', array('status' => 409));
            $token = bin2hex(random_bytes(32));
            set_transient('hs_transfer_' . hash('sha256', $token), $cart_token, 300);
            $response = new WP_REST_Response(array('url' => add_query_arg('hs_checkout', $token, home_url('/'))));
            $response->header('Cache-Control', 'no-store');
            return $response;
        },
    ));
});

// Adopt the existing Store API guest session, instead of copying items to an
// unrelated cart. WooCommerce owns prices, stock, taxes, shipping and payment.
add_action('plugins_loaded', function () {
    if (!isset($_GET['hs_checkout']) || !class_exists('WC_Session_Handler') || !class_exists(CartTokenUtils::class)) return;
    if (!defined('DONOTCACHEPAGE')) define('DONOTCACHEPAGE', true);
    $token = is_string($_GET['hs_checkout']) ? wp_unslash($_GET['hs_checkout']) : '';
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) return;
    $key = hash('sha256', $token);
    $cart_token = get_transient('hs_transfer_' . $key);
    if (!is_string($cart_token) || !CartTokenUtils::validate_cart_token($cart_token)) return;
    $payload = CartTokenUtils::get_cart_token_payload($cart_token);
    if (!is_string($payload['user_id'] ?? null) || !str_starts_with($payload['user_id'], 't_')) return;
    if (!hs_bridge_claim('hs_used_' . $key)) return;
    delete_transient('hs_transfer_' . $key);
    $GLOBALS['hs_checkout_customer'] = $payload['user_id'];

    class HS_Checkout_Session_Handler extends WC_Session_Handler {
        public function init_session_cookie() {
            $customer = $GLOBALS['hs_checkout_customer'] ?? '';
            if (!$customer) { parent::init_session_cookie(); return; }
            $data = $this->get_session($customer, array());
            if (empty($data['cart'])) { parent::init_session_cookie(); return; }
            $this->_customer_id = $customer;
            $this->_data = $data;
            $this->_dirty = true;
            $this->set_customer_session_cookie(true);
            $this->save_data();
            $GLOBALS['hs_checkout_adopted'] = true;
        }
    }
    add_filter('woocommerce_session_handler', function () { return HS_Checkout_Session_Handler::class; }, 100);
}, 30);

add_action('template_redirect', function () {
    if (!isset($_GET['hs_checkout'])) return;
    nocache_headers();
    header('Referrer-Policy: no-referrer');
    if (function_exists('wc_load_cart') && !WC()->cart) wc_load_cart();
    if (empty($GLOBALS['hs_checkout_adopted'])) wp_die('This checkout link has expired or the bag is empty. Please return to the storefront and open checkout again.', 'Checkout link unavailable', array('response' => 410));
    wp_safe_redirect(wc_get_checkout_url(), 303);
    exit;
}, 1);
