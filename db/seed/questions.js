const { v4: uuidv4 } = require("uuid");

module.exports = [
    {
        id: uuidv4(),
        question: 'Which one is not a possible img attribute?',
        answers: [
            'class',
            'alt',
            'target',
            'style'
        ],
        correct: 2
    },
    {
        id: uuidv4(),
        question: 'Which HTML term is not about images?',
        answers: [
            'figcaption',
            'image',
            'picture',
            'figure'
        ],
        correct: 1
    },
    {
        id: uuidv4(),
        question: 'Which attribute lets to add a tooltip to an element?',
        answers: [
            'name',
            'popup',
            'label',
            'title'
        ],
        correct: 3
    },
    {
        id: uuidv4(),
        question: 'What does HTML stand for?',
        answers: [
            'Hyper Transfer Markup Labeling',
            'High Transfer XML Language',
            'Hyper Text Markup Language',
            'Hyper Text XML Labeling'
        ],
        correct: 2
    },
    {
        id: uuidv4(),
        question: 'What year was the www invented?',
        answers: [
            '1990',
            '1989',
            '1991',
            '1988'
        ],
        correct: 1
    },
    {
        id: uuidv4(),
        question: 'Which element can not be used in head tag?',
        answers: [
            'nav',
            'link',
            'script',
            'meta'
        ],
        correct: 0
    },
    {
        id: uuidv4(),
        question: 'Which one is not a valid src attribute value of an image element?',
        answers: [
            'http://www.sitename.com/a.jpg',
            'www.sitename.org/a.jpg',
            'c://username/user/a.jpg',
            '/a.jpg'
        ],
        correct: 0
    },
    {
        id: uuidv4(),
        question: 'Which one is a block element?',
        answers: [
            'img',
            'picture',
            'canvas',
            'figure'
        ],
        correct: 3
    },
    {
        id: uuidv4(),
        question: 'Which one is not a valid src attribute value of an image element?',
        answers: [
            'http://www.sitename.com/a.jpg',
            'www.sitename.org/a.jpg',
            'c://username/user/a.jpg',
            '/a.jpg'
        ],
        correct: 0
    }
]