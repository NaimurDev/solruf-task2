const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 4002; 

// Middleware (optional) - For example, to parse JSON request bodies
app.use(express.json()); 

// Define routes
app.get('/', (req, res) => {
  res.send('Hello from Express.js!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});