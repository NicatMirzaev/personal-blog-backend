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
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
