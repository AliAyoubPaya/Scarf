<?php
/**
 * Plugin Name: HS Headless Checkout
 * Description: WooCommerce bridge and storefront colour-family management for the HS storefront.
 * Version: 0.3.0
 * Requires PHP: 8.1
 * Requires Plugins: woocommerce
 * WC requires at least: 10.7
 */
defined('ABSPATH') || exit;

use Automattic\WooCommerce\StoreApi\Utilities\CartTokenUtils;

// Each storefront colour is a separate product. This field links sibling
// products into the same colour-swatches row without exposing raw post meta.
add_action('woocommerce_product_options_general_product_data', function () {
    woocommerce_wp_text_input(array(
        'id'            => '_hs_color_group',
        'label'         => __('Storefront colour group', 'hs-headless-checkout'),
        'placeholder'   => 'rose-dust-satin',
        'description'   => __('Use the same value on every separate colour product in this family. Use lowercase letters, numbers and hyphens only.', 'hs-headless-checkout'),
        'desc_tip'      => true,
        'wrapper_class' => 'show_if_simple show_if_variable',
    ));
});

add_action('woocommerce_admin_process_product_object', function ($product) {
    if (!isset($_POST['_hs_color_group'])) return;
    $group = strtolower(sanitize_key(wp_unslash($_POST['_hs_color_group'])));
    if ($group === '') {
        $product->delete_meta_data('_hs_color_group');
        return;
    }
    if (!preg_match('/^[a-z0-9][a-z0-9_-]{0,79}$/', $group)) {
        WC_Admin_Meta_Boxes::add_error(__('Storefront colour group contains unsupported characters.', 'hs-headless-checkout'));
        return;
    }
    $product->update_meta_data('_hs_color_group', $group);
});

function hs_checkout_secret() {
    if (defined('HS_CHECKOUT_SECRET')) return HS_CHECKOUT_SECRET;
    $secret = get_option('hs_checkout_secret', '');
    return is_string($secret) ? $secret : '';
}

add_action('admin_menu', function () {
    add_submenu_page('woocommerce', 'Headless checkout', 'Headless checkout', 'manage_woocommerce', 'hs-headless-checkout', 'hs_checkout_settings_page');
});

function hs_checkout_settings_page() {
    if (!current_user_can('manage_woocommerce')) return;
    if (isset($_POST['hs_generate_secret'])) {
        check_admin_referer('hs_generate_checkout_secret');
        update_option('hs_checkout_secret', bin2hex(random_bytes(32)), false);
        echo '<div class="notice notice-success"><p>Checkout secret generated. Copy it to the storefront environment before leaving this page.</p></div>';
    }
    $secret = hs_checkout_secret();
    echo '<div class="wrap"><h1>Headless checkout</h1><p>This secret signs short-lived guest-cart handoffs. Keep it private and use the same value for <code>WOO_CHECKOUT_SECRET</code> in Vercel.</p>';
    if ($secret) {
        echo '<label for="hs-checkout-secret"><strong>Checkout secret</strong></label><input id="hs-checkout-secret" class="large-text code" type="text" readonly value="' . esc_attr($secret) . '">';
        echo '<p class="description">Generating a new value immediately invalidates the previous storefront configuration.</p>';
    } else {
        echo '<p><strong>Status:</strong> not configured. The checkout endpoint stays unavailable until a secret is generated.</p>';
    }
    echo '<form method="post">';
    wp_nonce_field('hs_generate_checkout_secret');
    submit_button($secret ? 'Rotate secret' : 'Generate secret', 'primary', 'hs_generate_secret');
    echo '</form></div>';
}

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
            $secret = hs_checkout_secret();
            if (strlen($secret) < 32 || strlen($request->get_body()) > 16000) return false;
            $signature = $request->get_header('X-HS-Signature');
            $body = $request->get_json_params();
            return is_array($body) && isset($body['issuedAt']) && is_int($body['issuedAt'])
                && abs(time() - $body['issuedAt']) <= 60
                && hash_equals(hash_hmac('sha256', $request->get_body(), $secret), $signature);
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
