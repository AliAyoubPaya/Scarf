import test from "node:test";
import assert from "node:assert/strict";
import { colorProductsFor, productOptionHref, selectedProductOption } from "../lib/catalog/product-colors.ts";
import { normalizeProduct } from "../lib/commerce/normalize-product.ts";

const productFixture = (id, slug, color, stockStatus = "in-stock", colorGroup) => ({
  id, source: { provider: "woocommerce", externalId: Number(id.replace(/\D/g, "")) }, slug,
  name: slug, color, price: 2500, currency: "PKR", images: [{ src: `https://shop.example.com/${slug}.jpg`, alt: slug }],
  stockStatus, colorCount: 1, tabs: ["new-in"], colorGroup,
});
const catalog = [
  productFixture("woo-1", "modal-sage", "Sage", "in-stock", "modal"),
  productFixture("woo-2", "modal-rose", "Rose", "in-stock", "modal"),
  productFixture("woo-3", "modal-black", "Black", "sold-out", "modal"),
  productFixture("woo-4", "chiffon-ivory", "Ivory"),
];
test("colour links navigate to independent products, not invented variations", () => {
  const siblings = colorProductsFor(catalog[0], catalog);
  assert.deepEqual(siblings.map((p) => p.id), ["woo-1", "woo-2", "woo-3"]);
  assert.equal(productOptionHref(siblings[2]), "/products/modal-black");
  assert.notEqual(siblings[0].source.externalId, siblings[2].source.externalId);
  assert.notDeepEqual(siblings[0].images, siblings[2].images);
  for (const p of siblings) assert.deepEqual(colorProductsFor(p, catalog).map((s) => s.id), siblings.map((s) => s.id));
});
test("missing groups do not combine unrelated products; sold-out siblings stay navigable", () => {
  assert.deepEqual(colorProductsFor(catalog[3], catalog), [catalog[3]]);
  const soldOut = colorProductsFor(catalog[0], catalog).find((p) => p.stockStatus === "sold-out");
  assert.equal(productOptionHref(soldOut), "/products/modal-black");
});
test("size query belongs only to the current colour product", () => {
  const product = { ...catalog[0], commerce: { type: "variable" }, variants: [
    { id: "woo-variant-42", wooId: 42, purchasable: true },
    { id: "woo-variant-43", wooId: 43, purchasable: false },
  ] };
  assert.equal(selectedProductOption(product, "43").wooId, 43);
  for (const query of ["999", ["43"], undefined]) assert.equal(selectedProductOption(product, query).wooId, 42);
  assert.equal(productOptionHref(product), "/products/modal-sage?variant=42");
});
test("Woo colours are separate parents with a shared group and independent cart IDs", () => {
  const base = { id: 1, name: "Modal Sage", slug: "modal-sage", type: "simple", status: "publish", price: "2500", stock_status: "instock", attributes: [{ name: "Color", options: ["Sage"] }], images: [{ src: "https://example.com/sage.jpg" }], meta_data: [{ key: "_hs_color_group", value: "modal-classic" }] };
  const sage = normalizeProduct(base, []);
  const rose = normalizeProduct({ ...base, id: 2, slug: "modal-rose", name: "Modal Rose", price: "2700", attributes: [{ name: "Color", options: ["Rose"] }], images: [{ src: "https://example.com/rose.jpg" }] }, []);
  assert.equal(colorProductsFor(sage, [sage, rose]).length, 2);
  assert.equal(selectedProductOption(rose).wooId, 2);
  assert.equal(rose.price, 2700);
  assert.equal(rose.images[0].src, "https://example.com/rose.jpg");
  assert.throws(() => normalizeProduct({ ...base, attributes: [{ name: "Color", options: ["Sage", "Rose"] }] }, []), /separate WooCommerce product/);
  assert.equal(normalizeProduct({ ...base, meta_data: [{ key: "_hs_color_group", value: { invalid: true } }] }, []).colorGroup, undefined);
});
