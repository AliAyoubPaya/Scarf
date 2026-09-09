import test from "node:test";
import assert from "node:assert/strict";
import { parseShopFilters, filterCollectionProducts, collectionLinks, sortOptions } from "../lib/catalog/collections.ts";

const products = [
  { id: "a", name: "Olive Modal", color: "Pistachio", fabric: "Modal", shade: "Green", price: 2850, stockStatus: "in-stock" },
  { id: "b", name: "Rose Satin", color: "Muted Rose", fabric: "Silk & satin", shade: "Pink", price: 3200, stockStatus: "in-stock" },
  { id: "c", name: "Black Chiffon", color: "Black", fabric: "Chiffon", shade: "Black", price: 3000, stockStatus: "sold-out" },
];
const filter = (query) => filterCollectionProducts(products, parseShopFilters(new URLSearchParams(query)));

test("default catalog preserves editorial order", () => assert.deepEqual(filter("").map((p) => p.id), ["a", "b", "c"]));
test("invalid and duplicate URL values are normalized", () => {
  const parsed = parseShopFilters(new URLSearchParams("fabric=Modal&fabric=Modal&fabric=Invalid&shade=Unknown&sort=best-selling&price=-10"));
  assert.deepEqual(parsed.fabrics, ["Modal"]);
  assert.deepEqual(parsed.shades, []);
  assert.equal(parsed.sort, "featured");
  assert.equal(parsed.price, "any");
});
test("multiple fabrics use OR; different filters use AND", () => {
  assert.equal(filter("fabric=Modal&fabric=Chiffon").length, 2);
  assert.deepEqual(filter("fabric=Modal&fabric=Chiffon&stock=1").map((p) => p.id), ["a"]);
  assert.equal(filter("fabric=Modal&shade=Pink").length, 0);
});
test("price bands include the exact 3000 boundary only in upper band", () => {
  assert.deepEqual(filter("price=under-3000").map((p) => p.id), ["a"]);
  assert.deepEqual(filter("price=3000-plus").map((p) => p.id), ["b", "c"]);
});
test("sorting does not mutate source products", () => {
  assert.deepEqual(filter("sort=price-desc").map((p) => p.id), ["b", "c", "a"]);
  assert.deepEqual(filter("sort=name-asc").map((p) => p.id), ["c", "a", "b"]);
  assert.deepEqual(products.map((p) => p.id), ["a", "b", "c"]);
});
test("search matches shade and ignores surrounding whitespace and case", () => assert.deepEqual(filter("q=%20PISTACHIO%20").map((p) => p.id), ["a"]));
test("new category tabs and sort options exclude best selling", () => {
  assert.ok(collectionLinks.every((link) => !link.slug.includes("best")));
  assert.ok(sortOptions.every((option) => !option.value.includes("best")));
});
