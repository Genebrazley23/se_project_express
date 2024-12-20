const HTTPError = require("./HTTPError");

const { FORBIDDEN } = require("./errors");

class ForbiddenError extends HTTPError {
  constructor(message = "Forbidden") {
    super(message, FORBIDDEN);
  }
}

module.exports = ForbiddenError;
