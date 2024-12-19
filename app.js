require("dotenv").config();
const { errors } = require("celebrate");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { SERVER_ERROR } = require("./utils/errors");
const mainRouter = require("./routes/index");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errors } = require("celebrate");
const app = express();
const { PORT = 3001, DB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

mongoose.set("strictQuery", true);
mongoose
  .connect(DB_URI, {})
  .then(() => {})
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter);
app.use(errorLogger);

app.use(errors());

const errHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500 ? "An error has occurred on the server." : err.message;
  res.status(statusCode).send({ message });
  next(err);
};

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

module.exports = errHandler;
