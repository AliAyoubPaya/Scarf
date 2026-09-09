import test from "node:test";
import assert from "node:assert/strict";
import { productStory, relatedProducts, productEnquiry } from "../lib/catalog/product-details.ts";

const catalog = Array.from({ length: 6 }, (_, index) => ({
  id: `woo-${index + 1}`, source: { provider: "woocommerce", externalId: index + 1 },
  slug: `test-scarf-${index + 1}`, name: `Test scarf ${index + 1}`, color: "Sage", price: 2500,
  currency: "PKR", images: [{ src: "https://shop.example.com/scarf.jpg", alt: "Test scarf" }],
  stockStatus: "in-stock", colorCount: 1, tabs: ["new-in"], fabric: "Modal", shade: "Green",
}));
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
  const draft = productEnquiry(catalog[0], 3, "https://example.com/products/test-scarf-1");
  for (const text of [catalog[0].name, catalog[0].color, "Quantity: 3", "https://example.com/products/test-scarf-1"]) assert.ok(draft.includes(text));
});
