const { celebrate, Joi } = require("celebrate");
const express = require("express");
const { auth, authOptional } = require("../middlewares/auth");
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
      name: Joi.string().required(),
      weather: Joi.string().required(),
      imageUrl: Joi.string().required(),
    }),
  }),
  createItem,
);

router.get("/", authOptional, getItems);

router.delete(
  "/:itemId",
  auth,
  celebrate({ params: Joi.object().keys({ itemId: Joi.string().required() }) }),
  deleteItem,
);
router.put(
  "/:itemId/likes",
  auth,
  celebrate({ params: Joi.object().keys({ itemId: Joi.string().required() }) }),
  likeItem,
);
router.delete(
  "/:itemId/likes",
  auth,
  celebrate({ params: Joi.object().keys({ itemId: Joi.string().required() }) }),
  dislikeItem,
);

module.exports = router;
