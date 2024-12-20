const HTTPError = require("./HTTPError.js");

const { BAD_REQUEST } = require("./errors");

class BadRequestError extends HTTPError {
  constructor(message = "Bad Request") {
    super(message, BAD_REQUEST);
  }
}

module.exports = BadRequestError;
