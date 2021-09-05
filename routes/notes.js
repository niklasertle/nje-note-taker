const note = require("express").Router();
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

// Promise version of readFile from file system
const readFromFile = util.promisify(fs.readFile);

// Gets the notes.json file to return to the API request
note.get("/", (req, res) => {
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)));
});

note.post("/", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    console.log(newNote);

    fs.readFile("./db/notes.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const notesData = JSON.parse(data);
        notesData.push(newNote);
        fs.writeFile(
          "./db/notes.json",
          JSON.stringify(notesData, null, 4),
          (err) =>
            err
              ? console.error(err)
              : console.info(`\nData written to './db/notes.json'`)
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting note");
  }
});

note.delete("/:id", (req, res) => {
    console.log(req.params.id);

    fs.readFile("./db/notes.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const notesData = JSON.parse(data);
        
        // For each notesData go through until req.params.id === notesData[i].id
        // Splice at this index to remove note
        // Return the new notesData array

        fs.writeFile(
          "./db/notes.json",
          JSON.stringify(notesData, null, 4),
          (err) =>
            err
              ? console.error(err)
              : console.info(`\nData written to './db/notes.json'`)
        );
      }
    });
});

module.exports = note;
