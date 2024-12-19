class ConflictError extends HTTPError {
  constructor(message = "Conflict") {
    super(message, CONFLICT);
  }
}

module.exports = ConflictError;
