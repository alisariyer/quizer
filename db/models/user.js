const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.findByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) return false;
    return user;
}

const User = model('user', userSchema);

module.exports = User;

