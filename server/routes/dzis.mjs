import express from "express";
import { getAllDzis, getDziById } from "../db/crud-dzis.mjs";

const router = express.Router();

// Get a list of all DZIs
router.get("/", async (req, res) => {

  const results = await getAllDzis();

  res.send(results).status(200);
});

// Get a DZI by ID
router.get("/id/:id", async (req, res) => {
  
  const result = await getDziById(req.params.id);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;