class NotFoundError extends HTTPError {
  constructor(message = "Not Found") {
    super(message, NOT_FOUND);
  }
}

module.exports = NotFoundError;
