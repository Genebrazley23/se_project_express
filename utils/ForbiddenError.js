const { FORBIDDEN } = require("./constants");

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
