import "server-only";
import { MongoClient } from "mongodb";

const connection = globalThis as typeof globalThis & { scarfMongo?: Promise<MongoClient> };
export async function database() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required in MongoDB catalog mode.");
  connection.scarfMongo ??= new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 8000 }).connect().catch((error) => { connection.scarfMongo = undefined; throw error; });
  return (await connection.scarfMongo).db(process.env.MONGODB_DATABASE || "scarf");
}
