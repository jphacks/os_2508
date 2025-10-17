const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("test");
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running at http://localhost:${PORT}`))