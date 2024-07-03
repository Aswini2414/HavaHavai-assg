const mongoose = require("mongoose");

const lostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
    },
    image: {
        type: String,
        required:true
    },
    desc: {
        type: String,
        required:true
    }
});

const lostitems = new mongoose.model("lostitems", lostSchema);

module.exports = lostitems;
