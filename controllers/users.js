const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator"); 
const User = require("../models/user");
const { BAD_REQUEST, SERVER_ERROR, NOT_FOUND, UNAUTHORIZED,CONFLICT } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server." })
    );

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "The 'name' field is required." });
  }

  if (name.length < 2) {
    return res.status(BAD_REQUEST).json({
      message: "The 'name' field must be at least 2 characters long.",
    });
  }

  if (name.length > 30) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "The 'name' field must be 30 characters or fewer." });
  }

  if (!avatar) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "The 'avatar' field is required." });
  }

  if (!email) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "The 'email' field is required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(BAD_REQUEST).json({
      message: "Please provide a valid email address.",
    });
  }

  if (!password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "The 'password' field is required." });
  }

  if (password.length < 10) {
    return res
      .status(CONFLICT)  
      .json({ message: "Password must be at least 10 characters long." });
 
}

  try {
   

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(CONFLICT).json({
        message: "A user with this email already exists.",
      });
    }
    if (error.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid data provided." });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server." });
  }
};

const getMe = (req, res) => {
  const userId  = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found." });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid user ID." });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

const updateMe = (req, res) => {
  const userId  = req.user._id;
  const { name,avatar } = req.body;
  if (!isValidObjectId(userId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });
  }
  return User.findByIdAndUpdate(
    userId,
    { $set: { name,avatar } },
    { new: true },
  )
    .then((user) =>
     user
        ? res.status(200).json({ data: user})
        : res.status(404).json({ message: "User not found" }),
    )
    .catch((e) =>
      res
        .status(500)
        .json({ message: "Error updating user", error: e.message })
    );
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

    return res.status(200).json({ message: "Authentication successful", user, token });
  } catch (error) {
    console.log(error)
    return res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
  }
};

module.exports = { getUsers, createUser, getMe, updateMe, login };
