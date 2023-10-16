import express from "express";
import { getAllNotes,getNoteById, updateNote } from "../db/crud-notes.mjs";
import { ObjectId } from "mongodb";
import { verifyJWT } from "../auth/verify.mjs";

const router = express.Router();

// Get a list of all notes
router.get("/", async (req, res) => {
  const results = await getAllNotes(); // get in alphabetical order
  res.send(results).status(200);
});

// Get a single note by ID
router.get("/id/:id", async (req, res) => {
  const result = await getNoteById(req.params.id);  
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Create a new note
router.post('/',async (req,res)=>{
  try {
    console.log(req);
    // note().fromPacket(req.body)
    res.send(result).status(201);
  }
  catch (e) {
    res.send(e).status(400);
  }
})

// TODO edit a note
router.patch('/id/:id', verifyJWT, async(req,res) => {
  const noteInfo = req.body;
  const results = await updateNote(req.params.id,noteInfo);

  if (results) return res.status(200).json({message:'Successfully updated note'});
  else return res.status(400).json({message:'Error updating note'});
})

// TODO delete a note (only valid if user is authorized and logged in! pass a valid token :))

export default router;