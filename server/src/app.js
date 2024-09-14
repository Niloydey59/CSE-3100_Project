const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser"); // third party middleware
const createError = require("http-errors"); // error-handling middleware
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");

const app = express();

//user request rate limiter
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use(xssClean());
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(bodyParser.json()); //allows to use json data in request body
app.use(bodyParser.urlencoded({ extended: true })); // allows to use form data in request body

app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to Express API",
  });
});
//test route

//client error handling
app.use((req, res, next) => {
  //res.status(404).json({ message: "route not found" });
  const error = createError(404, "route not found");
  next(error);
});

//server error handling
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
