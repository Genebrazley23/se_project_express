const { FORBIDDEN } = require("./errors");

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
