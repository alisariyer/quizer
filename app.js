const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const questions = require('./questions');

// setup view engine
app.set('view engine', 'ejs');
app.set('ejs', path.join(__dirname, 'views'));

// use express static middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    res.render('home');
});

// Show questions to guest
app.get('/questions', (req, res) => {
    res.render('questions', { questions });
});

// Get new question view
app.get('/questions/new', (req, res) => {
    res.render('new');
});

// Add new question
app.post('/questions/new', (req, res) => {
    console.log(req.body);
    res.send('OK');
})

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