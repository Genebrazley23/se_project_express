const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");
const authOptional = (req, res, next) => {
  try {
    const { headers } = req;
    const { authorization } = headers;
    const token = authorization.replace("Bearer ", "");

    console.log("token", token, JWT_SECRET);
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

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
    return res
      .status(UNAUTHORIZED)
      .json({ message: "No authorization header found" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    console.log("token", token, JWT_SECRET);
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (err) {
    console.error(err);
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};

module.exports = { auth, authOptional };
