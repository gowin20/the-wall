import express from "express";
import { getAllUsers, getUserByID, getUserByUsername, registerUser } from "../db/crud-users.mjs";
import { getNotesByUser } from "../db/crud-notes.mjs";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { verifyJWT } from "../auth/verify.mjs";

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


/*
Auth code
*/
router.get('/login', async (req,res)=>{
  res.send(token).status(200);
})

router.post('/register',async (req,res)=>{
  const userInfo = req.body;
  console.log(req.body);
  // TODO move bcrypt logic out of 'registerUser' and have that be for crud mongo only
  const response = await registerUser(userInfo);
  if (response === "OK") res.send(response).status(200);
  else (res.send(response).status(400));
})

router.post('/login', async (req,res) => {
  const loginAttempt = req.body;

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
})

router.get('/verifyLogin',verifyJWT,(req,res)=>{
  res.json({isLoggedIn:true, userInfo:req.userInfo})
})

export default router;