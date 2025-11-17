import { Router } from 'express';
import { DbLayoutObject } from 'gallery-image/dist/src/Layout.js';
const router = Router();

// Get a list of all layouts
router.get("/", async (req, res) => {
    const { getAllLayouts } = await import("../db/crud-layouts.js");
    const results = await getAllLayouts();
    res.send(results).status(200);
});

// Get a single layout by ID
router.get("/id/:id", async (req, res) => {

    const { getLayoutById } = await import("../db/crud-layouts.js");

    let result;
    if (req.params.id === 'defaultVertical') result = await getLayoutById(process.env.DEFAULT_LAYOUT_VERTICAL);
    else if (req.params.id === 'defaultHorizontal') result = await getLayoutById(process.env.DEFAULT_LAYOUT_HORIZONTAL);
    else result = await getLayoutById(req.params.id);
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});


// Get the default layout
router.get('/default', async (req, res) => {
    const { getLayoutById } = await import("../db/crud-layouts.js");

    const res1 = await getLayoutById(process.env.DEFAULT_LAYOUT_VERTICAL);
    const res2 = await getLayoutById(process.env.DEFAULT_LAYOUT_HORIZONTAL);
    const result = [res1,res2];
    if (!result) res.send('Not found').status(404);
    else res.send(result).status(200);
});

// TODO add routes for /generate/default and /generate/custom
export default router;