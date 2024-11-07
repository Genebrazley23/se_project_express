const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res
      .status(400)
      .json({ message: "All fields (name, weather, imageUrl) are required." });
  }

  return ClothingItem.create({ name, weather, imageUrl }) // Ensure return here
    .then((item) => res.status(201).json({ data: item }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(400).json({ message: e.message });
      }
      return res
        .status(500)
        .json({ message: "Error creating item", error: e.message });
    });
};

const getItems = (req, res) => {
  return ClothingItem.find() // Ensure return here
    .then((items) => res.status(200).json({ data: items }))
    .catch((e) =>
      res
        .status(500)
        .json({ message: "Error retrieving items", error: e.message }),
    );
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  if (!isValidObjectId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true },
  ) // Ensure return here
    .then((item) =>
      item
        ? res.status(200).json({ data: item })
        : res.status(404).json({ message: "Item not found" }),
    )
    .catch((e) =>
      res
        .status(500)
        .json({ message: "Error updating item", error: e.message }),
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndDelete(itemId) // Ensure return here
    .then((item) =>
      item
        ? res
            .status(200)
            .json({ message: "Item deleted successfully", data: item })
        : res.status(404).json({ message: "Item not found" }),
    )
    .catch((e) =>
      res
        .status(500)
        .json({ message: "Error deleting item", error: e.message }),
    );
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ) // Ensure return here
    .then((item) =>
      item
        ? res.status(200).json({ data: item })
        : res.status(404).json({ message: "Item not found" }),
    )
    .catch((e) =>
      res.status(500).json({ message: "Error liking item", error: e.message }),
    );
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ) // Ensure return here
    .then((item) =>
      item
        ? res.status(200).json({ data: item })
        : res.status(404).json({ message: "Item not found" }),
    )
    .catch((e) =>
      res
        .status(500)
        .json({ message: "Error unliking item", error: e.message }),
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
