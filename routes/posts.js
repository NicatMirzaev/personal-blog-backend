const express = require("express");
const router = express.Router();
const {
  INVALID_TOKEN,
  INVALID_SYNTAX,
  PERMISSION,
  TITLE_LENGTH,
  SLUG_LENGTH,
  EMPTY,
  POST_NOT_FOUND,
  COMMENT_NOT_FOUND,
} = require("../lib/error-codes");

module.exports = (User, Post, Comment) => {
  router.post("/add-post", async (req, res) => {
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (user.moderator !== true) return res.status(401).send(PERMISSION);
    const {
      title,
      img,
      summary,
      content,
      slug,
      category,
      pollActive,
      pollQuestion,
      pollOptions,
    } = req.body;

    if (
      title === undefined ||
      img === undefined ||
      summary === undefined ||
      content === undefined ||
      slug === undefined ||
      category === undefined ||
      pollActive === undefined ||
      pollOptions === undefined ||
      pollQuestion === undefined ||
      (pollActive === true && (!pollQuestion.length || pollOptions.length < 2))
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

    const options = {};
    pollOptions.forEach((option) => {
      options[option] = 0;
    });

    const post = new Post({
      title,
      img,
      summary,
      slug,
      content,
      category,
      pollActive,
      pollQuestion,
      pollOptions: options,
      createdAt: Date.now(),
    });
    await post.save();
    return res.status(200).send(post);
  });

  router.post("/update-post", async (req, res) => {
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (user.moderator !== true) return res.status(401).send(PERMISSION);
    const {
      postId,
      title,
      img,
      summary,
      content,
      slug,
      category,
      pollActive,
      pollQuestion,
      pollOptions,
    } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send(POST_NOT_FOUND);
    if (
      postId === undefined ||
      title === undefined ||
      img === undefined ||
      summary === undefined ||
      content === undefined ||
      slug === undefined ||
      category === undefined ||
      pollActive === undefined ||
      pollOptions === undefined ||
      pollQuestion === undefined ||
      (pollActive === true && (!pollQuestion.length || pollOptions.length < 2))
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

    const options = {};
    pollOptions.forEach((option) => {
      const hasKey = Object.prototype.hasOwnProperty.call(
        post.pollOptions,
        option
      );
      options[option] = hasKey ? post.pollOptions[option] : 0;
    });
    console.log(options);
    post.title = title;
    post.img = img;
    post.summary = summary;
    post.content = content;
    post.slug = slug;
    post.category = category;
    post.pollActive = pollActive;
    post.pollQuestion = pollQuestion;
    post.pollOptions = options;
    post.save();
    return res.status(200).send({ updated: true });
  });

  router.get("/popular-posts", async (req, res) => {
    const posts = await Post.find().sort({ likes: "desc" }).limit(3);
    return res.status(200).send(posts);
  });

  router.get("/latest-posts", async (req, res) => {
    const posts = await Post.find().sort({ createdAt: "desc" }).limit(3);
    return res.status(200).send(posts);
  });

  router.get("/get-posts", async (req, res) => {
    const { title, category } = req.query;
    const filters = {};
    if (title !== undefined && title.length) {
      filters.title = { $regex: title, $options: "i" };
    }
    if (category !== undefined && category !== "All") {
      filters.category = category;
    }
    let posts = [];
    if (Object.keys(filters).length > 0) {
      posts = await Post.find(filters);
    } else {
      posts = await Post.find();
    }
    return res.status(200).send(posts);
  });

  router.get("/get-post-by-slug", async (req, res) => {
    const { slug } = req.query;
    if (slug === undefined) return res.status(400).send(INVALID_SYNTAX);
    const post = await Post.findOne({ slug });
    if (!post) return res.status(404).send(POST_NOT_FOUND);
    post.views += 1;
    post.save();
    return res.status(200).send(post);
  });

  router.get("/get-post-by-id", async (req, res) => {
    const { id } = req.query;
    if (id === undefined) return res.status(400).send(INVALID_SYNTAX);
    const post = await Post.findById(id);
    if (!post) return res.status(404).send(POST_NOT_FOUND);
    return res.status(200).send(post);
  });

  router.get("/get-posts-by-category", async (req, res) => {
    const { category } = req.query;
    if (category === undefined) return res.status(400).send(INVALID_SYNTAX);
    const posts = await Post.find({ category });
    return res.status(200).send(posts);
  });
  router.post("/delete-post", async (req, res) => {
    const { postId } = req.body;
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (postId === undefined) return res.status(400).send(INVALID_SYNTAX);
    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(404).send(POST_NOT_FOUND);
    if (user.moderator !== true) return res.status(401).send(PERMISSION);

    post.remove();
    Comment.find({ postId: post._id }, (docs) => {
      if (docs) docs.remove();
    });

    return res.status(200).send({ deleted: true });
  });
  router.post("/like-post", async (req, res) => {
    const { postId } = req.body;
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (postId === undefined) return res.status(400).send(INVALID_SYNTAX);
    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(404).send(POST_NOT_FOUND);

    if (user.likes.includes(post._id)) {
      user.likes.pull(post._id);
      post.likes -= 1;
    } else {
      user.likes.push(post._id);
      post.likes += 1;
    }
    user.save();
    post.save();
    return res.status(200).send({ post, user });
  });

  router.post("/add-comment", async (req, res) => {
    const { postId, message } = req.body;
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (postId === undefined || message === undefined)
      return res.status(400).send(INVALID_SYNTAX);
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send(POST_NOT_FOUND);
    const messageLength = message.split(" ").join("").length;
    if (messageLength < 2) return res.status(400).send(EMPTY);
    const comment = new Comment({
      senderId: user._id,
      postId: post._id,
      message,
      createdAt: Date.now(),
    });
    post.comments += 1;
    comment.save();
    post.save();
    return res.status(200).send({ post, comment });
  });

  router.get("/get-comments", async (req, res) => {
    const { postId } = req.query;
    if (postId === undefined) return res.status(400).send(INVALID_SYNTAX);
    const comments = await Comment.find({ postId }).sort({ createdAt: "desc" });
    return res.status(200).send(comments);
  });

  router.post("/delete-comment", async (req, res) => {
    const { commentId } = req.body;
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (commentId === undefined) return res.status(400).send(INVALID_SYNTAX);
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).send(COMMENT_NOT_FOUND);
    console.log(user);
    console.log(comment);
    // eslint-disable-next-line eqeqeq
    if (user.moderator !== true && user._id != comment.senderId)
      return res.status(401).send(PERMISSION);
    comment.remove();
    return res.status(200).send({ deleted: true });
  });

  router.post("/like-comment", async (req, res) => {
    const { commentId } = req.body;
    if (!req.user) return res.status(400).send(INVALID_TOKEN);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).send(INVALID_TOKEN);
    if (commentId === undefined) return res.status(400).send(INVALID_SYNTAX);
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).send(COMMENT_NOT_FOUND);

    if (user.likes.includes(comment._id)) {
      user.likes.pull(comment._id);
      comment.likes -= 1;
    } else {
      user.likes.push(comment._id);
      comment.likes += 1;
    }
    user.save();
    comment.save();
    return res.status(200).send({ comment, user });
  });

  router.get("/get-latest-comments", async (req, res) => {
    const comments = await Comment.find().sort({ createdAt: "desc" }).limit(5);
    const returnComments = [];
    for (const comment of comments) {
      const post = await Post.findById(comment.postId);
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
