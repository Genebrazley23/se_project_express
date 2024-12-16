const { celebrate, Joi } = require("celebrate");
const express = require("express");
const { getMe, updateMe } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

const router = express.Router();
router.get("/me", auth, celebrate({ body: Joi.object().keys({}) }), getMe);
router.patch(
  "/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      avatar: Joi.string().required(),
    }),
  }),
  updateMe
);

module.exports = router;
