const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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

userSchema.statics.getScores = async (user_id) => {
    const user = await User.findById(user_id).populate('scores');
    if (!user) return false;
    return user.scores;
}

const User = model('user', userSchema);

module.exports = User;

