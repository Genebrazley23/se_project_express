const HTTPError = require("./HTTPError.js");
const { UNAUTHORIZED } = require("./errors");

class UnauthorizedError extends HTTPError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
