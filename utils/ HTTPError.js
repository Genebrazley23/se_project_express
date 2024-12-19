class HTTPError extends Error {
  constructor(message = "An error occurred", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = HTTPError;
