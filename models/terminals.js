const mongoose = require("mongoose");

const terminalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const terminals = new mongoose.model("terminals", terminalSchema);

module.exports = terminals;