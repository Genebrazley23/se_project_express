const HTTPError = require("./HTTPError");
const { CONFLICT } = require("./errors");

class ConflictError extends HTTPError {
  constructor(message = "Conflict") {
    super(message, CONFLICT);
  }
}

module.exports = ConflictError;
