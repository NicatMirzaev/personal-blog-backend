const express = require("express");
const router = express.Router();

module.exports = (User) => {
  router.get("/me", async (req, res, next) => {
    if (!req.user) return res.status(400).send({ error: "Invalid token." });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send({ error: "Invalid credentials." });
    return res.status(200).send(user);
  });
  return router;
};
