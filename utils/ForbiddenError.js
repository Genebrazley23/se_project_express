class ForbiddenError extends HTTPError {
  constructor(message = "Forbidden") {
    super(message, FORBIDDEN);
  }
}

module.exports = ForbiddenError;
