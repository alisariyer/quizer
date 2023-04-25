const express = require('express');
const app = express();
const questions = require('./questions');

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/questions', (req, res) => {
    console.log(questions);
    res.send(questions);
    // res.render('questions', { questions });
})


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});