const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const questions = require('./questions');

// setup view engine
app.set('view engine', 'ejs');
app.set('ejs', path.join(__dirname, 'views'));

// use middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true}))
app.use(express.json());

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
        correct,
        id: uuidv4()
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
    if (id) {
        const question = questions.find(question => question.id === id);
        return res.render('edit', { question });
    }
    res.status(400).send('Unknown Id, please check it: ' + id);
});

// UPDATE a specific question
app.put('/questions/question/:id', (req, res) => {
    const { id } = req.params;
    const { question, answers, correct } = req.body;
    if (id) {
        const index = questions.findIndex(question => question.id === id);
        if (id > -1) {
            questions[index] = {
                id,
                question,
                answers,
                correct,
            }
        }
        return res.send({ message: 'Updated'})
    }
    res.status(400).send({ message: 'Errrorrr...'})
});

// DELETE a specific question
app.delete('/questions/question/:id', (req, res) => {
    const { id } = req.params;
    const index = questions.findIndex(el => el.id === id);
    if (index > -1) questions.splice(index, 1);
    res.redirect('/questions/list');
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});