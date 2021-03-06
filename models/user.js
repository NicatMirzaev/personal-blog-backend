const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  profileId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  profileImg: {
    type: String,
    required: false,
  },
  moderator: {
    type: Boolean,
    required: false,
  },
  lastCommentAt: {
    type: Number,
    default: 0,
    required: false,
  },
  point: {
    type: Number,
    default: 0,
    required: false,
  },
  likes: {
    type: [String],
    required: false,
  },
  votes: Schema.Types.Mixed,
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
