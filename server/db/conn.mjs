import { MongoClient } from "mongodb";
import '../loadEnvironment.mjs'

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log('Connected to the wall DB')
} catch(e) {
  console.error(e);
}

let db = conn.db('wall');

export default db;