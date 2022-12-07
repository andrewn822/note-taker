const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const path = require('path');
const { readFromFile,
    readAndAppend,
    writeToFile, } = require ('./helpers/fsUtils')

// middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});
//  route for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// route for saved notes
app.get('/api/notes', (req ,res) => {
    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
});

app.post('/api/notes', (req, res) => {
    const { title, text, } = req.body
    
    if(title && text) {
        const newNote = {
            title,
            text,
            id: uuId()
        };
        readAndAppend(newNote, './db/db.json')
        res.json(`new note added succfessfully`)
    } else {
        console.log('no new notes posted')
    }
    
})

// get route for all *
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

//listening on port
app.listen(PORT, () =>
console.log(`app listening at http://localhost:${PORT}`))