const express = require("express");
const router = express.Router();
const {
  INVALID_TOKEN,
  INVALID_SYNTAX,
  BIO_LENGTH,
  NAME_LENGTH,
} = require("../lib/error-codes");

module.exports = (User) => {
  router.post("/update", async (req, res) => {
    const { bio, displayName, profileImg } = req.body;
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (
      bio === undefined ||
      displayName === undefined ||
      profileImg === undefined
    )
      return res.status(400).send(INVALID_SYNTAX);
    if (bio.length > 300) return res.status(400).send(BIO_LENGTH);
    if (displayName.length < 3 || displayName.length > 50)
      return res.status(400).send(NAME_LENGTH);

    user.bio = bio;
    user.displayName = displayName;
    user.profileImg = profileImg;
    await user.save();
    return res.status(200).send(user);
  });
  router.get("/me", async (req, res) => {
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    return res.status(200).send(user);
  });
  return router;
};
