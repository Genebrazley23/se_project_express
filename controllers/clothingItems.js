const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  SERVER_ERROR_MESSAGE,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res.status(BAD_REQUEST).json({
      message: "All fields (name, weather, imageUrl) are required.",
    });
  }

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json({ data: item }))
    .catch((e) =>
      e.name === "ValidationError"
        ? res.status(BAD_REQUEST).json({ message: "Invalid data provided." })
        : res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: SERVER_ERROR_MESSAGE }),
    );
};

const getItems = (req, res) =>
  ClothingItem.find()
    .then((items) => res.status(200).json({ data: items }))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE }),
    );

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  if (!isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true },
  )
    .then((item) =>
      item
        ? res.status(200).json({ data: item })
        : res.status(NOT_FOUND).json({ message: "Item not found" }),
    )
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE }),
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) =>
      item
        ? res
            .status(200)
            .json({ message: "Item deleted successfully", data: item })
        : res.status(NOT_FOUND).json({ message: "Item not found" }),
    )
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE }),
    );
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) =>
      item
        ? res.status(200).json({ data: item })
        : res.status(NOT_FOUND).json({ message: "Item not found" }),
    )
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE }),
    );
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) =>
      item
        ? res.status(200).json({ data: item })
        : res.status(NOT_FOUND).json({ message: "Item not found" }),
    )
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR_MESSAGE }),
    );
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
