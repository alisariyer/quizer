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

// Show questions to admin
app.get('/questions/list', (req, res) => {
    res.render('questions-list', { questions });
})

// Get a specific question
app.get('/questions/question/:id', (req, res) => {
    const { id } = req.params;
    if (/^[0-9]+$/.test(id)) {
        const question = questions.find(question => question.id === parseInt(id));
        return res.send(question);
    }
    res.status(400).send('Unknown Id, please check it: ' + id);
    // res.render('edit', { question });
});

// Update a specific question
app.put('/questions/question/:id', (req, res) => {
    res.send(req.params.id);
});

// Delete a specific question
app.delete('/questions/question/:id', (req, res) => {
    res.send('Deleting');
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});