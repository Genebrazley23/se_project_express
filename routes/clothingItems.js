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

router.post("/", auth, createItem);

router.get("/", authOptional, getItems);

router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
