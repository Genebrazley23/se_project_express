const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  SERVER_ERROR_MESSAGE,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res.status(BAD_REQUEST).json({
      message: "All fields (name, weather, imageUrl) are required.",
    });
  }

  try {
    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });
    return res.status(201).json({ data: item });
  } catch (e) {
    if (e.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data provided." });
    }
    console.error("Error creating item:", e);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: SERVER_ERROR_MESSAGE });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json({ data: items });
  } catch (e) {
    console.error("Error retrieving items:", e);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: SERVER_ERROR_MESSAGE });
  }
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(FORBIDDEN).json({ message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res
        .status(FORBIDDEN)
        .json({ message: "You are not authorized to delete this item" });
    }

    await ClothingItem.findByIdAndDelete(itemId);
    return res
      .status(200)
      .json({ message: "Item deleted successfully", data: item });
  } catch (e) {
    console.error("Error deleting item:", e);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: SERVER_ERROR_MESSAGE });
  }
};

const likeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return item
      ? res.status(200).json({ data: item })
      : res.status(NOT_FOUND).json({ message: "Item not found" });
  } catch (e) {
    console.error("Error liking item:", e);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: SERVER_ERROR_MESSAGE });
  }
};

const dislikeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return item
      ? res.status(200).json({ data: item })
      : res.status(NOT_FOUND).json({ message: "Item not found" });
  } catch (e) {
    console.error("Error disliking item:", e);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: SERVER_ERROR_MESSAGE });
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
