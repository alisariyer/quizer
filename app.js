const express = require('express');
const app = express();
const path = require('path');
const questions = require('./questions');

// setup view engine
app.set('view engine', 'ejs');
app.set('ejs', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/questions', (req, res) => {
    res.render('questions', { questions });
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});