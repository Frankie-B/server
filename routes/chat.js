const express = require('express');
const app = express();

app.get('/join', (req, res) => {
  res.json({ response: 'Server is up and running.' }).status(200);
});

module.exports = app;
