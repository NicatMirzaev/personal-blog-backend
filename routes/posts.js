const fs = require("fs");
const express = require("express");
const router = express.Router();
const {
  INVALID_TOKEN,
  INVALID_SYNTAX,
  PERMISSION,
  TITLE_LENGTH,
  SLUG_LENGTH,
  EMPTY,
} = require("../lib/error-codes");

module.exports = (User, Post) => {
  router.post("/add-post", async (req, res) => {
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (user.moderator !== true) return res.status(401).send(PERMISSION);
    const { title, img, summary, content, slug, category } = req.body;
    if (
      title === undefined ||
      img === undefined ||
      summary === undefined ||
      content === undefined ||
      slug === undefined ||
      category === undefined
    )
      return res.status(400).send(INVALID_SYNTAX);
    if (title.length < 5 || title.length > 100)
      return res.status(400).send(TITLE_LENGTH);
    if (slug.length < 3 || slug.length > 40)
      return res.status(400).send(SLUG_LENGTH);
    if (
      img.length < 1 ||
      summary.length < 1 ||
      content.length < 1 ||
      category.length < 1
    )
      return res.status(400).send(EMPTY);

    fs.writeFile(`posts/${slug}.txt`, content, (err) => {
      if (err) throw err;
      console.log(`File ${slug}.txt created successfully.`);
    });
    const post = new Post({
      title,
      img,
      summary,
      slug,
      category,
    });
    await post.save();
    return res.status(200).send(post);
  });

  router.get("/popular-posts", async (req, res) => {
    const posts = await Post.find().sort({ likes: "desc" }).limit(3);
    return res.status(200).send(posts);
  });

  router.get("/latest-posts", async (req, res) => {
    const posts = await Post.find().sort({ createdAt: "desc" }).limit(3);
    return res.status(200).send(posts);
  });
  return router;
};