import express from "express";
import { getAllUsers, getUserByID } from "../db/get-users.mjs";
import { getNotesByUser } from "../db/get-notes.mjs";

const router = express.Router();

// Get a list of all users
router.get("/", async (req, res) => {
    const results = await getAllUsers();
    res.send(results).status(200);
});

// Get a single user by ID
router.get("/id/:id", async (req, res) => {
    const result = await getUserByID(req.params.id);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

// Get all notes created by a user (ID)
router.get('/id/:id/notes', async (req,res) => {
  const result = await getNotesByUser(req.params.id);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
})


export default router;