const { Schema, model } = require('mongoose');

const scoreSchema = new Schema({
    score : {
        type: Number,
        required: true
    },
    seconds: {
        type: Number,
        required: true
    }
});

const Score = model('Score', scoreSchema);

module.exports = Score;

