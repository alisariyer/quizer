const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const questions = require('./questions');

// setup view engine
app.set('view engine', 'ejs');
app.set('ejs', path.join(__dirname, 'views'));

// use middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true}))

// GET home route
app.get('/', (req, res) => {
    res.render('home');
});

// GET questions to guest
app.get('/questions', (req, res) => {
    res.render('questions', { questions });
});

// GET new question
app.get('/questions/new', (req, res) => {
    res.render('new');
});

// POST new question
app.post('/questions/new', (req, res) => {
    const { question, answers, correct } = req.body;
    questions.push({
        question,
        answers,
        correct
    })
    res.redirect('/questions/list');
})

// GET questions for admin
app.get('/questions/list', (req, res) => {
    res.render('questions-list', { questions });
})

// GET a specific question
app.get('/questions/question/:id', (req, res) => {
    const { id } = req.params;
    if (/^[0-9]+$/.test(id)) {
        const question = questions.find(question => question.id === id);
        return res.send(question);
    }
    res.status(400).send('Unknown Id, please check it: ' + id);
    // res.render('edit', { question });
});

// UPDATE a specific question
app.put('/questions/question/:id', (req, res) => {
    res.send(req.params.id);
});

// DELETE a specific question
app.delete('/questions/question/:id', (req, res) => {
    const { id } = req.params;
    const index = questions.findIndex(el => el.id === id);
    questions.splice(index, 1);
    res.redirect('/questions/list');
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});