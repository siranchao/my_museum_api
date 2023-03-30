const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    favorites: [String],
    history: [String]
});

module.exports = userSchema;