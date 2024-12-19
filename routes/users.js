const { celebrate, Joi } = require("celebrate");
const express = require("express");
const { getMe, updateMe } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/me", auth, getMe);

router.patch(
  "/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      avatar: Joi.string().uri().required(),
    }),
  }),
  updateMe
);

module.exports = router;
