const ClothingItem = require("../models/clothingItem");
const mongoose = require("mongoose");

const createItem = (req, res) => {
  console.log(req.user);
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res
      .status(400)
      .send({ message: "All fields (name, weather, imageUrl) are required." });
  }

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(400).send({ message: e.message });
      }
      res
        .status(500)
        .send({ message: "Error from createItem", error: e.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((e) => {
      res
        .status(500)
        .send({ message: "Error retrieving items", error: e.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      res
        .status(500)
        .send({ message: "Error updating item", error: e.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }

      res
        .status(200)
        .send({ message: "Item deleted successfully", data: item });
    })
    .catch((e) => {
      res
        .status(500)
        .send({ message: "Error deleting item", error: e.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json({ data: item });
    })
    .catch((e) => {
      res.status(500).json({ message: "Error liking item", error: e.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  // Validate if itemId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json({ data: item });
    })
    .catch((e) => {
      res
        .status(500)
        .json({ message: "Error unliking item", error: e.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
