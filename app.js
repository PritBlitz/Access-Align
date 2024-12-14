const express = require("express");
const createHttpError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
// usage of morgan , gets the status
app.use(morgan("dev"));
// So that status 500 does not come we need to set view engine to ejs
app.set("view engine", "ejs");

app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/user", require("./routes/user.route"));

// route not defined by the application : error handler :
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status); // status 404  can be handled by writing this
  res.send(error);
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("MongoDB connected ... ");
    app.listen(PORT, () => console.log(`🍾 on port ${PORT}`));
  })
  .catch((err) => console.log(err.message));
