const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name should be between 2 and 30 characters long"],
    maxlength: [30, "Name should be between 2 and 30 characters long"],
  },

  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
    message: "Weather must be either 'hot', 'warm', or 'cold'.",
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "link is not vaild",
    },
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
