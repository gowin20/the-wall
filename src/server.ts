import './loadEnvironment.js';

import express from 'express';
import cors from 'cors';

import routerNotes from './routes/notes.js';
import routerUsers from './routes/users.js';
import routerLayouts from './routes/layouts.js';
import routerDzi from './routes/dzis.js';
import routerIiif from './routes/iiif.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/notes', routerNotes);
app.use('/users', routerUsers);
app.use('/layouts', routerDzi);
app.use('/iiif', routerIiif);
app.use('/dzis', routerLayouts);

// Export for serverless lambda deployment
export default app;

// Local Express server for testing 
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
