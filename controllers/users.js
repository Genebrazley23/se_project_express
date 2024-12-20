const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../utils/errors/BadRequestError.js");
const ConflictError = require("../utils/errors/ConflictError.js");
const UnauthorizedError = require("../utils/errors/UnauthorizedError.js");
const NotFoundError = require("../utils/errors/NotFoundError.js");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");

const validateUserInput = ({ name, avatar, email, password }) => {
  if (!name || name.length < 2 || name.length > 30) {
    throw new BadRequestError(
      name.length < 2
        ? "The 'name' field must be at least 2 characters long."
        : "The 'name' field must be 30 characters or fewer."
    );
  }

  if (!avatar) {
    throw new BadRequestError("The 'avatar' field is required.");
  }

  if (!email || !validator.isEmail(email)) {
    throw new BadRequestError(
      email
        ? "Please provide a valid email address."
        : "The 'email' field is required."
    );
  }

  if (!password || password.length < 6) {
    throw new BadRequestError(
      password
        ? "Password must be at least 6 characters long."
        : "The 'password' field is required."
    );
  }
};

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    validateUserInput({ name, avatar, email, password });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({ data: userResponse });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictError("A user with this email already exists."));
    }
    if (error.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided."));
    }
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return next(error);
  }
};

const updateMe = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("User not found.");
    }

    return res.status(200).json({ data: updatedUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided."));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required."));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Incorrect email or password.");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res
      .status(200)
      .json({ message: "Authentication successful", token, data: user });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createUser, getMe, updateMe, login };
