import { MongoClient } from "mongodb";
if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not configured."); process.exit(1); }
const client = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 1, serverSelectionTimeoutMS: 8000 });
try {
  const db = client.db(process.env.MONGODB_DATABASE || "scarf");
  await db.command({ ping: 1 });
  console.log(JSON.stringify({ connected: true, previewProducts: await db.collection("demo_products").countDocuments(), syncedProducts: await db.collection("products").countDocuments({ catalog: { $ne: null } }) }));
} catch { console.error("MongoDB connection failed. Check credentials and network access."); process.exitCode = 1; }
finally { await client.close(); }
