const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: Number,
    default: 0,
  },
  pollActive: {
    type: Boolean,
    default: false,
  },
  pollQuestion: {
    type: String,
    default: "",
  },
  pollOptions: Schema.Types.Mixed,
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

const Post = mongoose.model("posts", postSchema);
module.exports = Post;
