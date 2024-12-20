const { UNAUTHORIZED } = require("./errors");

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
