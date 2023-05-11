const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    scores: {
        type: [Schema.Types.ObjectId],
        ref: 'Score'
    }
});

userSchema.statics.findByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return false;
    return user;
}

userSchema.statics.getScores = async (email) => {
    const user = await User.findOne({ email}).populate('scores');
    if (!user) return false;
    return user.scores;
}

const User = model('user', userSchema);

module.exports = User;

