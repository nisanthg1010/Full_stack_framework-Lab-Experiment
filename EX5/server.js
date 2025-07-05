const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const FILE_PATH = path.join(__dirname, 'data', 'todos.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/todos', (req, res) => {
  fs.readFile(FILE_PATH, (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading todos' });
    res.json(JSON.parse(data));
  });
});

app.post('/api/todos', (req, res) => {
  fs.writeFile(FILE_PATH, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Error saving todos' });
    res.json({ success: true });
  });
});

app.listen(3000, () => console.log("🚀 Running at http://localhost:3000"));
