const { BAD_REQUEST } = require("./errors");

class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequestError;
