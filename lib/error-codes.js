module.exports = {
  INVALID_TOKEN: {
    errorCode: "invalid-token",
    message: "User not found or invalid token.",
  },
  INVALID_SYNTAX: {
    errorCode: "invalid-syntax",
    message: "Invalid syntax.",
  },
  PERMISSION: {
    errorCode: "permission",
    message: "You dont have permission to access.",
  },
  BIO_LENGTH: {
    errorCode: "bio-length",
    message: "Biography can be up to 300 characters.",
  },
  NAME_LENGTH: {
    errorCode: "name-length",
    message: "The name must be between 3 and 300 characters.",
  },
  TITLE_LENGTH: {
    errorCode: "title-length",
    message: "The title must be between 5 and 100 characters.",
  },
  SLUG_LENGTH: {
    errorCode: "slug-length",
    message: "The slug must be between 3 and 40 characters.",
  },
  EMPTY: {
    errorCode: "empty",
    message: "Fields can not be empty.",
  },
  POST_NOT_FOUND: {
    errorCode: "post-not-found",
    message: "Post not found.",
  },
  COMMENT_NOT_FOUND: {
    errorCode: "comment-not-found",
    message: "Comment not found.",
  },
  COMMENT_COOLDOWN: {
    errorCode: "comment-cooldown",
    message: "Wait 1 minute to post a comment again.",
  },
  INVALID_EMAIL: {
    errorCode: "invalid-email",
    message: "Invalid email address.",
  },
};
