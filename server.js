const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const path = require('path');
const uuId = require('./helpers/uuuid');
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
app.delete('/api/notes/:id', (req, res) => {
    console.info(req.method)
    const delNoteID = req.params.id
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        //the result will be returned as an array with all of the notes except the note with id that was passed in as a param
        const result = json.filter((note) => note.id !== delNoteID)
        console.log(result)

        //re-write the result array to db.json
        writeToFile('./db/db.json', result)

        //response to let client know delete request has been completed
        res.json(`note with ${delNoteID} has been deleted`)
    })
})

// get route for all *
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

//listening on port
app.listen(PORT, () =>
console.log(`app listening at http://localhost:${PORT}`))