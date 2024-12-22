const express = require("express");
const { celebrate, Joi } = require("celebrate");
const router = express.Router();
const { login, createUser } = require("../controllers/users");
const userRoutes = require("./users");
const clothingItem = require("./clothingItems");
const { NotFoundError } = require("../utils/errors"); // Corrected import

const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
const signupSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
  }),
};

router.post("/signin", celebrate(loginSchema), login);
router.post("/signup", celebrate(signupSchema), createUser);
router.use("/users", userRoutes);
router.use("/items", clothingItem);

router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
