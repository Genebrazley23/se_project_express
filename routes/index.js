const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND} = require("../utils/errors");

router.use("/users", userRoutes);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Route not found" });
});

module.exports = router;
