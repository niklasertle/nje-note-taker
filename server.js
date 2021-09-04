const express = require('express');
const path = require('path');
const app = express();
const api = require('./routes/index')
const PORT = process.env.PORT || 3001;

// Middleware to use
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

// Sends the intiial homepage of the app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Sends the /notes page of the app
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// 404 page for any route that is not supported
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/404.html'))
});

app.listen(PORT);