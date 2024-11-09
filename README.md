## Project Description

This project is a RESTful API for managing a clothing inventory, allowing users to add, view, and delete clothing items. Each item includes information like the item name, an image URL, the intended weather type, and the item's creator. The API has several key routes that interact with a MongoDB database to store and retrieve item information, allowing for a seamless way to manage and filter clothing items based on weather and user preferences.

## Technologies and Techniques Used

- Node.js and Express: The main framework and runtime for building the API.
- MongoDB and Mongoose: The database and ORM for handling data models, schema validation, and database interactions.
- ESLint: A tool for maintaining consistent code quality and adhering to JavaScript best practices.
  -Error Handling: Custom error handling middleware to provide meaningful responses for various errors, using specific error codes stored in a utils/errors.js file.

# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

# Define Routes in routes/index.js:

const express = require("express");
const router = express.Router();
const userRoutes = require("./users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRoutes);
router.use("/items", clothingItem);

router.use((req, res) => {
res.status(NOT_FOUND).json({ message: "Route not found" });
});

module.exports = router;

# Use Routes in app.js:

const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", true);

mongoose
.connect("mongodb://127.0.0.1:27017/wtwr_db", {})
.then(() => {
console.log("Connected to DB");
})
.catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
req.user = {
\_id: "6729810b78a36130fb2e93dd",
};
next();
});

app.use("/", mainRouter);
app.listen(PORT, () => {
console.log(`App listening at port ${PORT}`);
});

# Created Error Codes in utils/errors.js:

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports = {
SERVER_ERROR_MESSAGE: "An error has occurred on the server",
BAD_REQUEST,
NOT_FOUND,
SERVER_ERROR,
};
