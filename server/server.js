require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/notes', require('./routes/notes.js'));
app.use('/users',require('./routes/users.js'));
app.use('/layouts',require('./routes/layouts.js'));
app.use('/dzis',require('./routes/dzis.js'));

// Export for serverless lambda deployment
module.exports = app;


/*
// Local Express server for testing 
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
*/