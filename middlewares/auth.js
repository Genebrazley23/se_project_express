const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { BAD_REQUEST, UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { headers } = req;
  const { authorization } = headers;

  if (!authorization) {
    return res
      .status(BAD_REQUEST)
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

module.exports = auth;
