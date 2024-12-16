const express = require("express");
const router = express.Router();
const { login, createUser } = require("../controllers/users");
const userRoutes = require("./users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRoutes);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Route not found" });
});

module.exports = router;
