const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    message: "Password must be at least 10 characters long",
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new Error("Incorrect email or password");
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          throw new Error("Incorrect email or password");
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
