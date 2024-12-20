import HTTPError from "./HTTPError.js";
const { FORBIDDEN } = require("./errors");

class ForbiddenError extends HTTPError {
  constructor(message = "Forbidden") {
    super(message, FORBIDDEN);
  }
}

module.exports = ForbiddenError;
