const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const clothingItem = require("./clothingItems");
const { BAD_REQUEST} = require("../utils/errors");

router.use("/users", userRoutes);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(200).json({ message: "Route not found" });
});

module.exports = router;
