import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all users
router.get("/", async (req, res) => {
    let collection = await db.collection('users');
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
    let collection = await db.collection('users');
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });


export default router;