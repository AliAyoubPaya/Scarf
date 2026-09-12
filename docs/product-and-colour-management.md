# Product and colour management

The storefront product source of truth is WooCommerce. Each published colour is a separate WooCommerce product with its own slug, images, SKU, stock and price. Products that should appear as colour circles on one another's product pages share the same `_hs_color_group` value. Version 0.3.0 or newer of the included **HS Headless Checkout** WordPress plugin makes this value editable through the normal product editor.

## Where to edit the colour family

1. Install or update `wordpress/hs-headless-checkout/` and activate **HS Headless Checkout**.
2. Open **WordPress → Products** and edit a product.
3. In **Product data → General**, find **Storefront colour group** below the price fields.
4. Enter a short family ID such as `rose-dust-satin`. This is an internal grouping key, not the customer-facing colour name.
5. Give every separate colour product that belongs in the same swatch row the exact same family ID, then update each product.

For example, the separate Black, Warm Ivory and Blush Pink products all receive `rose-dust-satin`. Products with another group ID do not appear in this row.

## Add another colour circle

1. In **WordPress → Products**, duplicate the closest colour product.
2. Change the product name, permalink slug and SKU so they are unique.
3. In **Product data → Attributes**, keep exactly one customer-facing `Color` value, such as `Sage Green`.
4. Replace the product and gallery images with photographs of that colour.
5. In **Product data → General**, confirm **Storefront colour group** matches the other products in this family.
6. Confirm price and inventory, then publish or update.
7. The WooCommerce webhook copies the updated product to MongoDB and the new circle appears automatically.

## Remove or move a colour circle

To temporarily hide a colour, set that WooCommerce product to Draft. To remove only its link with this family, clear or change **Storefront colour group** and update the product. To permanently remove it, use the application's deletion approval flow: WordPress deletion only marks the MongoDB snapshot as deletion-pending and does not remove it automatically.

Do not add several colour values to one simple product. The sync rejects that shape because every colour must retain its own URL and image gallery.

## Checkout

The customer stays on `/checkout` for contact details, delivery address and order summary. WooCommerce remains responsible for live totals, inventory and order creation. Only payment methods returned by the WooCommerce Store API are offered; raw card details are never posted to the Next.js application.
