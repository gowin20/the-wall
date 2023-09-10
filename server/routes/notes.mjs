import express from "express";
import { getAllNotes,getNoteById } from "../db/notes.mjs";

const router = express.Router();

// Get a list of all notes
router.get("/", async (req, res) => {
    const results = await getAllNotes();
    res.send(results).status(200);
});

// Get a single note by ID
router.get("/id/:id", async (req, res) => {
    const result = await getNoteById(req.params.id);  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

export default router;