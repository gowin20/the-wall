import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all layouts
router.get("/", async (req, res) => {
    let collection = await db.collection('layouts');
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// Get a single layout by ID
router.get("/id/:id", async (req, res) => {
    let collection = await db.collection('layouts');
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

// Get the default layout
router.get('/default', async (req, res) => {
    let collection = await db.collection('layouts');
    let query = {default:true};
    let result = await collection.findOne(query);

    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
});

// TODO add routes for /generate/default and /generate/custom

export default router;