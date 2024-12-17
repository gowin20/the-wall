const { MongoClient } = require('mongodb');
require('dotenv').config();

const connectionString = process.env.ATLAS_URI || "";
console.log('conn:',connectionString);

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log('Connected to the wall DB')
} catch(e) {
  console.error(e);
}

const db = conn.db('wall');

module.exports = {db};
