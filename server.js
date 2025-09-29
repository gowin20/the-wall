import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/notes', (await import('./routes/notes.js')));
app.use('/users',(await import('./routes/users.js')));
app.use('/layouts',(await import('./routes/layouts.js')));
app.use('/dzis',(await import('./routes/dzis.js')));

// Export for serverless lambda deployment
export default app;


/*
// Local Express server for testing 
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
*/