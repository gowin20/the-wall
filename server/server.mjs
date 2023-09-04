import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import notes from "./routes/notes.mjs";
import users from "./routes/users.mjs";
import layouts from './routes/layouts.mjs';
import dzis from './routes/dzis.mjs';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/notes', notes);
app.use('/users',users);
app.use('/layouts',layouts);
app.use('/dzis',dzis);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});