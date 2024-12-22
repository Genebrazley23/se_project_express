const { SERVER_ERROR, SERVER_ERROR_MESSAGE } = require("./constants");

class InternalServerError extends Error {
  constructor(message = SERVER_ERROR_MESSAGE) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = SERVER_ERROR;
  }
}

module.exports = InternalServerError;
