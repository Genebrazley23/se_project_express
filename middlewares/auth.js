const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors"); // Custom error class

const authOptional = (req, res, next) => {
  try {
    const { headers } = req;
    const { authorization } = headers;

    if (authorization) {
      const token = authorization.replace("Bearer ", "");

      console.log("token", token, JWT_SECRET);
      const payload = jwt.verify(token, JWT_SECRET);

      req.user = payload;
    }
    return next();
  } catch (err) {
    console.error(err);
    return next();
  }
};

const auth = (req, res, next) => {
  const { headers } = req;
  const { authorization } = headers;

  if (!authorization) {
    return next(new UnauthorizedError("No authorization header found"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    console.log("token", token, JWT_SECRET);
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    return next();
  } catch (err) {
    console.error(err);

    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

module.exports = { auth, authOptional };
