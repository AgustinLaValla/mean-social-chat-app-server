const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: [true, 'Username is required'] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // img: { type: String, required: false },
}, { timestamps: true });

module.exports = model('User', userSchema);
