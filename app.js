const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { SERVER_ERROR } = require("./utils/errors");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");

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

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", mainRouter);

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(SERVER_ERROR).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
