const HTTPError = require("./HTTPError");
const { UNAUTHORIZED } = require("./errors");

class UnauthorizedError extends HTTPError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
