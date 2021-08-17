const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  senderId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

const Comment = mongoose.model("comments", commentSchema);
module.exports = Comment;
