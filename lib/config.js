require("dotenv").config();

module.exports = {
  DATABASE_URL: process.env.MONGO_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  SECRET_KEY: process.env.SECRET_KEY,
  MAIL_SERVICE: process.env.MAIL_SERVICE,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  BETA_PASSWORD: process.env.BETA_PASSWORD,
  BETA_USER_ID: process.env.BETA_USER_ID,
  API_URL:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_API_URL
      : process.env.PROD_API_URL,
  FRONTEND_URL:
    process.env.NODE_ENV === "development"
      ? process.env.DEV_FRONTEND_URL
      : process.env.PROD_FRONTEND_URL,
};
