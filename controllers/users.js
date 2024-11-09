const User = require("../models/user");
const { BAD_REQUEST, SERVER_ERROR, NOT_FOUND } = require("../utils/errors");

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server." }),
    );

const createUser = async (req, res) => {
  const { name, avatar } = req.body;

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

  try {
    const user = await User.create({ name, avatar });
    return res.status(201).json(user);
  } catch (error) {
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

const getUser = (req, res) => {
  const { userId } = req.params;

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

module.exports = { getUsers, createUser, getUser };
