//import {client} from '../lambda.js';
import { MongoClient } from "mongodb";
// import '../loadEnvironment.js'
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";
console.log('conn:',connectionString)

const client = new MongoClient(connectionString);

// Connection happens in lambda.js
let db = await client.db('wall');
export default db;