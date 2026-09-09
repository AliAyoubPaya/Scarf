import test from "node:test";
import assert from "node:assert/strict";
import { featuredProducts } from "../lib/catalog/products.ts";
import { productStory, relatedProducts, productEnquiry } from "../lib/catalog/product-details.ts";

const catalog = featuredProducts.map((product, index) => ({ ...product, fabric: index % 2 ? "Chiffon" : "Modal", shade: "Green" }));
test("related products exclude the current scarf and prefer its fabric without changing the catalog", () => {
  const before = [...catalog];
  const related = relatedProducts(catalog[0], catalog);
  assert.equal(related.length, 4);
  assert.ok(related.every((item) => item.id !== catalog[0].id && item.fabric === "Modal"));
  assert.deepEqual(catalog, before);
});
test("all fabric collections have product copy", () => {
  for (const fabric of ["Modal", "Chiffon", "Silk & satin", "Jersey", "Georgette"]) {
    assert.ok(productStory({ ...catalog[0], fabric }).length > 50);
  }
});
test("enquiry includes the selected product, shade, quantity and link", () => {
  const draft = productEnquiry(catalog[0], 3, "https://example.com/products/olive-mist-modal-hijab");
  for (const text of [catalog[0].name, catalog[0].color, "Quantity: 3", "https://example.com/products/olive-mist-modal-hijab"]) assert.ok(draft.includes(text));
});
