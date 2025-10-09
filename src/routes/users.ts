//const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { verifyJWT } from "../verify.js";
import express from 'express';
const router = express.Router();

// Get a list of all users
router.get("/", async (req, res) => {
  const { getAllUsers } = await import("../db/crud-users.js");

  const results = await getAllUsers({alphabetical:true});
  res.send(results).status(200);
});

// Get a single user by ID
router.get("/id/:id", async (req, res) => {
  const { getUserByID } = await import("../db/crud-users.js");

  const result = await getUserByID(req.params.id);
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Get a single user by username
router.get('/username/:username', async (req, res) => {
  const { getUserByUsername } = await import("../db/crud-users.js");

  const result = await getUserByUsername(req.params.username);
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
})

// Get all notes created by a user (ID)
router.get('/id/:id/notes', async (req,res) => {
  const { getNotesByUser } = await import("../db/crud-notes.js");
  const result = await getNotesByUser(req.params.id);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
})

router.post('/addName', verifyJWT, async (req,res) => {
  const { insertFakeUser } = await import("../db/crud-users.js");
  // 'addName' takes a name only and returns a new creator object.
  const creatorInfo = req.body;
  const result = await insertFakeUser(creatorInfo.name);
  if (result) res.status(200).json(result);
  else res.status(500).json({message:'Unable to add creator.'})
})

/*
Auth code
*/
/*

NOT WORKING RIGHT NOW - need to fix a problem with bcrypt for registration to work properly. See below

router.post('/register',async (req,res)=>{
  const { registerUser } = await import("../db/crud-users.mjs");


  const userInfo = req.body;
  console.log(req.body);
  // TODO move bcrypt logic out of 'registerUser' and have that be for crud mongo only
  const response = await registerUser(userInfo);
  if (response === "OK") res.send(response).status(200);
  else (res.send(response).status(400));
})
*/

router.post('/login', async (req,res) => {
  const loginAttempt = req.body;
  

  if (Object.keys(loginAttempt).length === 0 || !loginAttempt.username || !loginAttempt.password) return res.status(401).json({message:'Invalid login attempt. Please provide a username and password.'})

  const { getUserByUsername } = await import("../db/crud-users.js");
  const dbUser = await getUserByUsername(loginAttempt.username);

  if (!dbUser) return res.status(401).json({message:'Invalid username or password'});

  bcrypt.compare(loginAttempt.password, dbUser.password, (err,data)=>{
    if (err) throw err;
    if (!data) {
      return res.status(401).json({message:'Invalid username or password'});
    }
    console.log('Password match');
    // Username and password combo is valid, time to sign in
    const payload = {
      id: dbUser._id,
      username: dbUser.username,
      isAdmin: dbUser.isAdmin
    }
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {expiresIn:86400},
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({message:'Successfully signed in', token:`Bearer ${token}`, userInfo:payload})
      }
    )
  });
});

router.get('/verifyLogin',verifyJWT,(req: any,res)=>{
  res.json({isLoggedIn:true, userInfo:req.userInfo})
});

export default router;