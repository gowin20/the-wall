import express from "express";
import {dirname, join} from "path";
import {fileURLToPath} from "url";
//const router = require("./lib/router");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { PORT = 3001} = process.env;
const app = express();

app.get("/api/v1",(req,res)=>{
    res.json({
        project: "The Wall",
        from: "George and Armin"
    });
});

app.get("/",(_req,res)=>{
    res.status(200).send("backend is online");
})

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
})