const User = require("../models/user");
const { BAD_REQUEST, SERVER_ERROR } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createUser = async (req, res) => {
  if (!req.body.name) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "The 'name' field is required." });
  }

  if (req.body.name.length < 2) {
    return res.status(BAD_REQUEST).json({
      message: "The 'name' field must be at least 2 characters long.",
    });
  }

  if (req.body.name.length > 30) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "The 'name' field must be 30 characters or fewer." });
  }

  if (!req.body.avatar) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "The 'avatar' field is required." });
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      res
        .status(BAD_REQUEST)
        .json({ message: "ValidationError", error: error.message });
    } else {
      res
        .status(SERVER_ERROR)
        .json({ message: "Server error", error: error.message });
    }
  }
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "User not found" });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
