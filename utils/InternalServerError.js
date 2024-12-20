import HTTPError from '../HTTPError.js';

const { SERVER_ERROR, SERVER_ERROR_MESSAGE } = require("./errors");

class InternalServerError extends HTTPError {
  constructor(message = SERVER_ERROR_MESSAGE) {
    super(message, SERVER_ERROR);
  }
}

module.exports = InternalServerError;
