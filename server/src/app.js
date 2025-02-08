const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser"); // third party middleware
const cookieParser = require("cookie-parser"); // third party middleware
const createError = require("http-errors"); // error-handling middleware
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const groupRouter = require("./routers/groupRouter");
const commentRouter = require("./routers/commentRouter");

const app = express();

/* //user request rate limiter
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
}); */

// Middleware to parse cookies
app.use(cookieParser());
// Middleware to sanitize user input coming from POST body, GET queries, and url params
app.use(xssClean());
//app.use(rateLimiter);
app.use(morgan("dev"));

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Also parse JSON data
// Middleware to parse multipart/form-data

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Enable cookies to be sent across domains
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Headers allowed in requests
  })
);

app.options("*", cors()); // Enable CORS for all preflight requests

app.use("/api/seed", seedRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/groups", groupRouter);
app.use("/api/comments", commentRouter);

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
