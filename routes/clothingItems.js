const { celebrate, Joi } = require("celebrate");
const express = require("express");
const { auth } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const router = express.Router();
router.post(
  "/",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(3).max(30).required(),
      weather: Joi.string().valid("hot", "warm", "cold").required(),
      imageUrl: Joi.string().uri().required(),
    }),
  }),
  createItem
);
router.get("/", getItems);
router.delete(
  "/:itemId",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteItem
);
router.put(
  "/:itemId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24).hex().required(), // Ensured itemId is a 24-char hex string
    }),
  }),
  likeItem
);
router.delete(
  "/:itemId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeItem
);
module.exports = router;
