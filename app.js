const express = require('express');
const app = express();
const path = require('path');
const questions = require('./questions');

// use express static middleware
app.use(express.static(path.join(__dirname, 'public')));

// setup view engine
app.set('view engine', 'ejs');
app.set('ejs', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/questions', (req, res) => {
    res.render('questions', { questions });
});

app.get('/questions/list', (req, res) => {
    res.render('questions-list', { questions });
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});