const express = require("express");

const router = express.Router();

const userRoutes = require("./users");
const clothingItem = require("./clothingItems");
const { getItems } = require("../controllers/clothingItems");

router.use("/users", userRoutes);
router.use("/items", clothingItem);
router.get("/items", getItems);

module.exports = router;
