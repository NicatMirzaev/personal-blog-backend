const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { FRONTEND_URL, SECRET_KEY } = require("../lib/config");

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
      const token = jwt.sign({ id: req.user._id }, SECRET_KEY, {
        expiresIn: "30d",
      });
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
      const token = jwt.sign({ id: req.user._id }, SECRET_KEY, {
        expiresIn: "30d",
      });
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
      const token = jwt.sign({ id: req.user._id }, SECRET_KEY, {
        expiresIn: "30d",
      });
      res.redirect(`${FRONTEND_URL}/login-success?token=${token}`);
    }
  );
  return router;
};
