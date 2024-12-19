const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

const SERVER_ERROR_MESSAGE = "An error has occurred on the server";

class HTTPError extends Error {
  constructor(message = "An error occurred", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends HTTPError {
  constructor(message = "Bad Request") {
    super(message, BAD_REQUEST);
  }
}

class UnauthorizedError extends HTTPError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED);
  }
}

class ForbiddenError extends HTTPError {
  constructor(message = "Forbidden") {
    super(message, FORBIDDEN);
  }
}

class NotFoundError extends HTTPError {
  constructor(message = "Not Found") {
    super(message, NOT_FOUND);
  }
}

class ConflictError extends HTTPError {
  constructor(message = "Conflict") {
    super(message, CONFLICT);
  }
}

class InternalServerError extends HTTPError {
  constructor(message = SERVER_ERROR_MESSAGE) {
    super(message, SERVER_ERROR);
  }
}

module.exports = {
  HTTPError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
};
