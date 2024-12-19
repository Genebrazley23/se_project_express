class InternalServerError extends HTTPError {
  constructor(message = SERVER_ERROR_MESSAGE) {
    super(message, SERVER_ERROR);
  }
}

module.exports = { InternalServerError };
