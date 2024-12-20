const { CONFLICT } = require("./errors");

class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;
