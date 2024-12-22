const { CONFLICT } = require("./constants");

class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;
