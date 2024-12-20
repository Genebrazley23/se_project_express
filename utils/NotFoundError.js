const HTTPError = require("./HTTPError.js");

const { NOT_FOUND } = require("./errors");

class NotFoundError extends HTTPError {
  constructor(message = "Not Found") {
    super(message, NOT_FOUND);
  }
}

module.exports = NotFoundError;
