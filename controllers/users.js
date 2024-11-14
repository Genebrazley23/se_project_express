const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator"); 
const User = require("../models/user");
const { BAD_REQUEST, SERVER_ERROR, NOT_FOUND, UNAUTHORIZED, CONFLICT } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(BAD_REQUEST).json({
      message: name
        ? name.length < 2
          ? "The 'name' field must be at least 2 characters long."
          : "The 'name' field must be 30 characters or fewer."
        : "The 'name' field is required.",
    });
  }

  if (!avatar) {
    return res.status(BAD_REQUEST).json({ message: "The 'avatar' field is required." });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(BAD_REQUEST).json({
      message: email ? "Please provide a valid email address." : "The 'email' field is required.",
    });
  }

  if (!password || password.length < 6) {
    return res.status(BAD_REQUEST).json({
      message: password
        ? "Password must be at least 6 characters long."
        : "The 'password' field is required.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 6);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return res.status(200).json({ data: userResponse });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(CONFLICT).json({ message: "A user with this email already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({
        message: "Invalid data provided.",
        errors: error.errors,
      });
    }
    return res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
  }
};

const getMe = (req, res) => {
  const userId = req.user._id;

  User.findById(userId).select('-password') 
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found." });
      }
      return res.status(200).json({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid user ID." });
      }
      return res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    });
};

const updateMe = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { $set: { name, avatar } },
    { new: true, runValidators: true, select: '-password' } 
  )
    .then((user) => 
      user
        ? res.status(200).json({ data: user })
        : res.status(NOT_FOUND).json({ message: "User not found" })
    )
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({
          message: "Invalid data provided.",
          errors: error.errors,
        });
      }
      return res.status(SERVER_ERROR).json({ message: "Error updating user" });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "Incorrect email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(UNAUTHORIZED).json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ message: "Authentication successful", token });
  } catch (error) {
    console.log(error);
    return res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
  }
};

module.exports = { createUser, getMe, updateMe, login };
