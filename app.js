const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
const passport = require("./lib/passport")(User);
const { SECRET_KEY } = require("./lib/config");

require("./lib/db");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users")(User, Post, Comment);
const postsRouter = require("./routes/posts")(User, Post, Comment);
const authRouter = require("./routes/auth")(passport);

const app = express();

// auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.get("Authorization").slice(7);
    if (!token) {
      req.user = null;
    } else {
      req.user = jwt.verify(token, SECRET_KEY);
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(cors());
app.use(authMiddleware);
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/auth", authRouter);

module.exports = app;
