const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const path = require('path');

// middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});