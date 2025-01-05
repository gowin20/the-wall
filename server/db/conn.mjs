import {client} from '../lambda.js';

// Connection happens in lambda.js
let db = await client.db('wall');
export default db;