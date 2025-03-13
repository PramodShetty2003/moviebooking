const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    genreid:{ type: Number, required: true , unique: true },
    genre: { type: String, required: true}
});

module.exports = mongoose.model('Genre', genreSchema);