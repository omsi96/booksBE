const express = require("express");
const cors = require("cors");
const app = express();
const booksRoutes = require("./routes/books");
const authorsRoutes = require("./routes/authors");
const authenticationRoutes = require("./routes/authentication");
const db = require("./db/models");
const {
  errorMiddleware,
  notFoundMiddleware,
} = require("./middleware/errorMiddleware");

const path = require("path");
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/media", express.static(path.join(__dirname, "media")));

// Routes Middleware
app.use("/books", booksRoutes);
app.use("/authors", authorsRoutes);
app.use(authenticationRoutes);

app.use(errorMiddleware);
app.use(notFoundMiddleware);
const run = async () => {
  try {
    // TODO: MAKE SURE TI REMOVE force
    // await db.sequelize.sync();
    // await db.sequelize.sync({ force: true });
    await db.sequelize.sync({ alter: true });
    console.log("Connection to the database successful!");
    await app.listen(80, () => {
      console.log("The application is running on localhost:80");
    });
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

run();
