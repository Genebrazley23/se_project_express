const { SERVER_ERROR, SERVER_ERROR_MESSAGE } = require("./errors");

class InternalServerError extends Error {
  constructor(message = SERVER_ERROR_MESSAGE) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = SERVER_ERROR;
  }
}

module.exports = InternalServerError;
