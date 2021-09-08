const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  FRONTEND_URL,
  SECRET_KEY,
  BETA_PASSWORD,
  BETA_USER_ID,
} = require("../lib/config");
const { INVALID_SYNTAX, PERMISSION } = require("../lib/error-codes");

module.exports = (passport) => {
  router.get(
    "/google",
    passport.authenticate("google", {
      session: false,
      scope: ["profile", "email"],
    })
  );
  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
      // Successful authentication, redirect frontend.
      const token = jwt.sign(
        { id: req.user._id === undefined ? req.user[0]._id : req.user._id },
        SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );
      res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
    }
  );
  router.get(
    "/twitter",
    passport.authenticate("twitter", {
      session: false,
    })
  );
  router.get(
    "/twitter/callback",
    passport.authenticate("twitter", { session: false }),
    (req, res) => {
      // Successful authentication, redirect frontend.
      const token = jwt.sign(
        { id: req.user._id === undefined ? req.user[0]._id : req.user._id },
        SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );
      res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
    }
  );
  router.get(
    "/github",
    passport.authenticate("github", {
      session: false,
    })
  );
  router.get(
    "/github/callback",
    passport.authenticate("github", { session: false }),
    (req, res) => {
      // Successful authentication, redirect frontend.
      const token = jwt.sign(
        { id: req.user._id === undefined ? req.user[0]._id : req.user._id },
        SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );
      res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
    }
  );

  router.get("/beta-login", (req, res) => {
    const { password } = req.query;
    if (password === undefined) return res.status(400).send(INVALID_SYNTAX);
    if (password !== BETA_PASSWORD) return res.status(401).send(PERMISSION);

    const token = jwt.sign({ id: BETA_USER_ID }, SECRET_KEY, {
      expiresIn: "30d",
    });
    return res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
  });
  return router;
};
