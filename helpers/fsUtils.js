const util = require('util');
const fs = require('fs');


const readFromFile = util.promisify(fs.readFile);
/** 
    @param {string} destination
    @param {object} content
    @returns {void} 
*/  

const writeToFile = (destination, content) => 
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
    );
    
/**
 
    @param {object} content
    @param {string} file 
    @returns {void} 
 */

 const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };
  
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
  module.exports = { readFromFile, writeToFile, readAndAppend };