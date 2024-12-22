const { UNAUTHORIZED } = require("./constants");

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
