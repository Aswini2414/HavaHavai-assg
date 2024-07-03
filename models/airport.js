const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    terminals: {
        type: String,
        required: true
    }
});

const airport = new mongoose.model("airport", airportSchema);

module.exports = airport;