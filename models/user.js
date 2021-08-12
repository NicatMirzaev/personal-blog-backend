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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
