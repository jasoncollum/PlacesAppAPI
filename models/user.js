const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 7 },
    image: { type: String, required: true },
    places: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);  // checks new email address is not already in use

module.exports = mongoose.model('User', userSchema);