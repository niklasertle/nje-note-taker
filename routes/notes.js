const note = require("express").Router();
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require("uuid");

// Converts readFile() to a promise function instead of a callback
const readFromFile = util.promisify(fs.readFile);

// Gets the notes.json file to return to the API request
note.get("/", (req, res) => {
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)));
});

// Adds notes to the notes.json file with a post request
note.post("/", (req, res) => {
  const { title, text } = req.body;

  // Creates a new note if the title and text exist
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    // Reads the notes.json file as long as there is no error it then parses it to see an array and pushes the new note into the array, then returns it back to the file
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
            err ? console.error(err) : console.info(`\nData written to notes`)
        );
      }
    });

    // Response to let user now it was successfully added
    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    // If there is nothing in the title or text of the note returns an error
    res.json("Error in posting note");
  }
});

// Deletes notes from the notes.json file based on the ID generated for each note
note.delete("/:id", (req, res) => {
  // Gets the notes.json file and returns the data to be parsed to an array as long as there is no error
  fs.readFile("./db/notes.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notesData = JSON.parse(data);

      // Goes through the array and checks to see if the ID for the note that the user wants to delete matches the ID for the note in the array and removes the note that matches the ID
      for (let i = 0; i < notesData.length; i++) {
        const element = notesData[i];
        if (element.id === req.params.id) {
          notesData.splice(i, 1);
        }
      }

      // Writes the array back to a JSON file as a string
      fs.writeFile(
        "./db/notes.json",
        JSON.stringify(notesData, null, 4),
        (err) =>
          err ? console.error(err) : console.info(`\nData deleted from notes`)
      );

      // Response to let user know it was a success
      const response = {
        status: "success",
        body: "Note deleted",
      };

      res.json(response);
    }
  });
});

module.exports = note;
