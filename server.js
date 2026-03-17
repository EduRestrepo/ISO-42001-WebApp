const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const getFilePath = (name) => path.join(DATA_DIR, `${name}.json`);

// Generic API for JSON files
app.get('/api/data/:name', (req, res) => {
    const filePath = getFilePath(req.params.name);
    if (!fs.existsSync(filePath)) return res.json(null);
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
});

app.post('/api/data/:name', (req, res) => {
    const filePath = getFilePath(req.params.name);
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});

app.delete('/api/data/all', (req, res) => {
    const files = fs.readdirSync(DATA_DIR);
    files.forEach(f => fs.unlinkSync(path.join(DATA_DIR, f)));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`ISO 42001 Tracker Server running at http://localhost:${PORT}`);
});
