class UnauthorizedError extends HTTPError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
