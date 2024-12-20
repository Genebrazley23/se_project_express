import HTTPError from "../HTTPError.js";

const { CONFLICT } = require("./errors");

class ConflictError extends HTTPError {
  constructor(message = "Conflict") {
    super(message, CONFLICT);
  }
}

module.exports = ConflictError;
