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

// Show questions to guest
app.get('/questions', (req, res) => {
    res.render('questions', { questions });
});

// Add a new question
app.get('/questions/new', (req, res) => {
    res.render('new');
});

// Edit a question
app.get('/questions/:id', (req, res) => {
    const { id } = req.params;
    if (/^[0-9]+$/.test(id)) {
        const question = questions.find(question => question.id === parseInt(id));
        return res.send(question);
    }
    res.status(400).send('Unknown Id, please check it: ' + id);
    // res.render('edit', { question });
})

// Show questions to admin
app.get('/questions/list', (req, res) => {
    res.render('questions-list', { questions });
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});