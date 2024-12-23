const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name should be between 2 and 30 characters long"],
    maxlength: [30, "Name should be between 2 and 30 characters long"],
  },
  weather: {
    type: String,
    required: true,
    enum: {
      values: ["hot", "warm", "cold"],
      message: "Weather must be either 'hot', 'warm', or 'cold'.",
    },
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not valid",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner ID is required"],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
