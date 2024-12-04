const express = require("express");
const { getMe, updateMe } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

const router = express.Router();
router.get("/me", auth, getMe);
router.patch("/me", auth, updateMe);

module.exports = router;
