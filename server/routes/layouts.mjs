import express from "express";
import { getAllLayouts, getLayoutById } from "../db/crud-layouts.mjs";
import '../loadEnvironment.mjs'

const router = express.Router();

// Get a list of all layouts
router.get("/", async (req, res) => {
    const results = await getAllLayouts();
    res.send(results).status(200);
});

// Get a single layout by ID
router.get("/id/:id", async (req, res) => {
    let result;
    if (req.params.id === 'defaultVertical') result = await getLayoutById(process.env.DEFAULT_LAYOUT_VERTICAL);
    else if (req.params.id === 'defaultHorizontal') result = await getLayoutById(process.env.DEFAULT_LAYOUT_HORIZONTAL);
    else result = await getLayoutById(req.params.id);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

// Get the default layout
router.get('/default', async (req, res) => {
    const result = await getDefaultLayout();

    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
});

// TODO add routes for /generate/default and /generate/custom

export default router;