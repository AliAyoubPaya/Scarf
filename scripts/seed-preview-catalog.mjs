import { MongoClient } from "mongodb";
import { demoColorGroups, colorProductsFor } from "../lib/catalog/product-colors.ts";
import { featuredProducts } from "../lib/catalog/products.ts";

if (!process.argv.includes("--confirm") || !process.env.MONGODB_URI || process.env.CATALOG_MODE !== "mongodb-preview") {
  console.error("Set MONGODB_URI and CATALOG_MODE=mongodb-preview in .env.local, then run with --confirm. Only demo_products will be written.");
  process.exit(1);
}
const taxonomy = [
  ["Modal", "Green"], ["Silk & satin", "Pink"], ["Chiffon", "Ivory"], ["Jersey", "Blue"], ["Modal", "Green"],
  ["Silk & satin", "Pink"], ["Silk & satin", "Printed"], ["Modal", "Brown"], ["Chiffon", "Black"], ["Georgette", "Printed"],
];
const catalog = featuredProducts.map((product, index) => ({ ...product, colorGroup: demoColorGroups[product.id], fabric: taxonomy[index][0], shade: taxonomy[index][1] }));
const rows = catalog.map((product) => ({ _id: product.source.externalId, fetchedAt: new Date(), catalog: {
  ...product, commerce: { synced: false, purchasable: false, type: "simple" },
  colorCount: colorProductsFor(product, catalog).length,
  variants: [{ id: `demo-${product.id}`, wooId: null, color: product.color, label: product.color, price: product.price, images: product.images, stockStatus: product.stockStatus, purchasable: false, attributes: [] }],
} }));
const client = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 2, serverSelectionTimeoutMS: 8000 });
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DATABASE || "scarf");
  const collection = db.collection("demo_products");
  await collection.createIndex({ "catalog.slug": 1 }, { unique: true });
  await collection.bulkWrite(rows.map((row) => ({ replaceOne: { filter: { _id: row._id }, replacement: row, upsert: true } })));
  console.log(`Saved ${rows.length} non-purchasable preview products to MongoDB demo_products. Live products were not modified.`);
} catch { console.error("MongoDB setup failed. Check connection credentials, database permissions and Atlas network access. No secrets have been printed."); process.exitCode = 1; }
finally { await client.close(); }
