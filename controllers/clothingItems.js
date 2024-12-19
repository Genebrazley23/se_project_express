const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} = require("../utils/errors");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return next(
      new BadRequestError("All fields (name, weather, imageUrl) are required.")
    );
  }

  try {
    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });
    return res.status(201).json({ data: item }); // Ensure to return here
  } catch (e) {
    if (e.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided."));
    }
    return next(new InternalServerError());
  }
};

const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json({ data: items }); // Ensure to return here
  } catch (e) {
    return next(new InternalServerError());
  }
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return next(new BadRequestError("Invalid item ID."));
  }

  try {
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return next(new NotFoundError("Item not found."));
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return next(
        new ForbiddenError("You are not authorized to delete this item.")
      );
    }

    await item.remove(); // Avoid extra query by calling `remove` on the document directly

    return res
      .status(200)
      .json({ message: "Item deleted successfully", data: item }); // Ensure to return here
  } catch (e) {
    return next(new InternalServerError());
  }
};

const likeItem = async (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return next(new BadRequestError("Invalid item ID."));
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      return next(new NotFoundError("Item not found."));
    }

    return res.status(200).json({ data: item });
  } catch (e) {
    return next(new InternalServerError());
  }
};

const dislikeItem = async (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return next(new BadRequestError("Invalid item ID."));
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!item) {
      return next(new NotFoundError("Item not found."));
    }

    return res.status(200).json({ data: item });
  } catch (e) {
    return next(new InternalServerError());
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
