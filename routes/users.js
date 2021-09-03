const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  INVALID_TOKEN,
  INVALID_SYNTAX,
  BIO_LENGTH,
  NAME_LENGTH,
  PERMISSION,
} = require("../lib/error-codes");

const findByIdFixed = (Model, id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Model.findById(id);
  }
  return null;
};

module.exports = (User, Post, Comment) => {
  router.post("/update", async (req, res) => {
    const { userId, bio, displayName, profileImg } = req.body;
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    if (
      bio === undefined ||
      displayName === undefined ||
      profileImg === undefined ||
      userId === undefined
    )
      return res.status(400).send(INVALID_SYNTAX);

    const user = await findByIdFixed(User, req.user.id);
    const targetUser = await findByIdFixed(User, userId);
    if (!user || !targetUser) return res.status(401).send(INVALID_TOKEN);

    // eslint-disable-next-line eqeqeq
    if (user.moderator !== true && user._id != userId)
      return res.status(401).send(PERMISSION);
    if (bio.length > 300) return res.status(400).send(BIO_LENGTH);
    if (displayName.length < 3 || displayName.length > 50)
      return res.status(400).send(NAME_LENGTH);

    targetUser.bio = bio;
    targetUser.displayName = displayName;
    targetUser.profileImg = profileImg;
    await targetUser.save();
    return res.status(200).send(targetUser);
  });
  router.get("/me", async (req, res) => {
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await findByIdFixed(User, req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    return res.status(200).send(user);
  });
  router.get("/get-user", async (req, res) => {
    const { id } = req.query;
    if (id === undefined) return res.status(400).send(INVALID_SYNTAX);
    const user = await findByIdFixed(User, id);
    if (!user) return res.status(400).send(INVALID_TOKEN);
    return res.status(200).send(user);
  });

  router.get("/get-user-liked-posts", async (req, res) => {
    const { userId } = req.query;
    if (userId === undefined) return res.status(400).send(INVALID_SYNTAX);
    const user = await findByIdFixed(User, userId);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    const posts = [];
    for (const id of user.likes) {
      if (id.length) {
        const post = await findByIdFixed(Post, id);
        if (post) {
          posts.push(post);
        }
      }
    }
    return res.status(200).send(posts);
  });

  router.get("/get-user-comments", async (req, res) => {
    const { userId } = req.query;
    if (userId === undefined) return res.status(400).send(INVALID_SYNTAX);
    const user = await findByIdFixed(User, userId);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    const comments = await Comment.find({ senderId: userId });
    const returnComments = [];
    for (const comment of comments) {
      const post = await findByIdFixed(Post, comment.postId);
      returnComments.push({
        ...comment._doc,
        postTitle: post ? post.title : null,
        postSlug: post ? post.slug : null,
      });
    }
    return res.status(200).send(returnComments);
  });
  return router;
};
