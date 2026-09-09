import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { normalizeProduct, isColorAttribute } from "../lib/commerce/normalize-product.ts";
import { sameOrigin, validQuantity, verifyWebhook } from "../lib/commerce/security.ts";
import { money } from "../lib/commerce/cart-types.ts";

const product = { id: 101, name: "Everyday &amp; Occasion", slug: "everyday", type: "variable", status: "publish", price: "2000", stock_status: "instock", images: [{ src: "https://shop.example.com/parent.jpg" }], attributes: [{ name: "Color", options: ["Sage"] }], meta_data: [{ key: "_hs_color_group", value: "everyday-modal" }], categories: [{ slug: "modal" }], tags: [{ slug: "new-in" }], date_modified_gmt: "2026-09-08T00:00:00" };
const variants = [
  { id: 201, status: "publish", price: "2200", stock_status: "instock", attributes: [{ name: "Size", option: "S" }], image: { src: "https://shop.example.com/sage.jpg" } },
  { id: 202, status: "publish", price: "2300", stock_status: "outofstock", attributes: [{ name: "Size", option: "M" }], image: { src: "https://shop.example.com/sage-medium.jpg" } },
];
test("Single-colour MongoDB snapshot preserves size IDs, images, prices and stock", () => {
  const result = normalizeProduct(product, variants);
  assert.equal(result.name, "Everyday & Occasion");
  assert.equal(result.fabric, "Modal");
  assert.equal(result.colorGroup, "everyday-modal");
  assert.equal(result.color, "Sage");
  assert.equal(result.variants[1].label, "M");
  assert.deepEqual(result.tabs, ["new-in"]);
  assert.equal(result.variants[0].wooId, 201);
  assert.equal(result.variants[1].price, 2300);
  assert.equal(result.variants[1].purchasable, false);
  assert.deepEqual(result.variants[1].images.map((i) => i.src), ["https://shop.example.com/sage-medium.jpg", product.images[0].src]);
});
test("size options without an image inherit their own colour product gallery", () => {
  const result = normalizeProduct(product, [{ ...variants[0], image: undefined }]);
  assert.equal(result.variants[0].images[0].src, product.images[0].src);
});
test("simple products keep their full gallery and use their real Woo product ID", () => {
  const result = normalizeProduct({ ...product, type: "simple" }, []);
  assert.equal(result.variants[0].wooId, 101);
  assert.equal(result.variants[0].images[0].src, product.images[0].src);
});
test("draft, hidden and unsupported products are not listed", () => {
  for (const overrides of [{ status: "draft" }, { catalog_visibility: "hidden" }, { type: "external" }]) assert.equal(normalizeProduct({ ...product, ...overrides }, variants), null);
});
test("unpriced, wildcard and draft variants cannot be purchased", () => {
  for (const overrides of [{ price: "" }, { attributes: [{ name: "Size", option: "" }] }]) assert.equal(normalizeProduct(product, [{ ...variants[0], ...overrides }]).variants[0].purchasable, false);
  assert.equal(normalizeProduct(product, [{ ...variants[0], status: "private" }]), null);
});
test("Woo colour attributes and minor-unit amounts are handled correctly", () => {
  assert.ok(isColorAttribute("pa_color")); assert.ok(isColorAttribute("Colour")); assert.ok(!isColorAttribute("Size"));
  assert.ok(money("285000", "PKR", 2).includes("2,850"));
});
test("webhook signatures reject tampering and missing or short secrets", () => {
  const secret = "test-secret-".repeat(4), body = JSON.stringify({ id: 101 });
  const signature = createHmac("sha256", secret).update(body).digest("base64");
  assert.ok(verifyWebhook(body, signature, secret));
  assert.ok(!verifyWebhook(body + " ", signature, secret));
  assert.ok(!verifyWebhook(body, signature, ""));
});
test("cart requests require same origin and bounded integer quantities", () => {
  assert.ok(sameOrigin(new Request("https://store.example.com/api/cart", { headers: { origin: "https://store.example.com" } })));
  assert.ok(!sameOrigin(new Request("https://store.example.com/api/cart", { headers: { origin: "https://evil.example.com" } })));
  assert.ok(!sameOrigin(new Request("https://store.example.com/api/cart")));
  for (const value of [0, -1, 1.2, "2", 100, null]) assert.ok(!validQuantity(value));
  for (const value of [1, 2, 99]) assert.ok(validQuantity(value));
});
