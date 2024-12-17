require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5050;


app.use(cors());
app.use(express.json());

app.use('/notes', require('./routes/notes.js'));
app.use('/users',require('./routes/users.js'));
app.use('/layouts',require('./routes/layouts.js'));
app.use('/dzis',require('./routes/dzis.js'));

module.exports.handler = serverless(app);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
