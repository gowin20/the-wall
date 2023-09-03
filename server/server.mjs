import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import notes from "./routes/notes.mjs";
import users from "./routes/users.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/notes', notes);
app.use('/users',users);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});