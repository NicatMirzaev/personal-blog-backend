const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  API_URL,
} = require("./config");

module.exports = (User) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${API_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, cb) => {
        let user = await User.find({ profileId: profile.id });
        if (!user.length) {
          user = new User({
            profileId: profile.id,
            displayName: profile.displayName,
            email:
              profile._json.email_verified === true
                ? profile._json.email
                : null,
            profileImg: profile._json.picture || null,
          });

          await user.save();
        }
        cb(null, user);
      }
    )
  );
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: `${API_URL}/auth/twitter/callback`,
        includeEmail: true,
      },
      async (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        let user = await User.find({ profileId: profile.id });
        if (!user.length) {
          user = new User({
            profileId: profile.id,
            displayName: profile.displayName,
            bio: profile._json.description,
            email: profile.emails.length > 0 ? profile.emails[0].value : null,
            profileImg:
              profile.photos.length > 0 ? profile.photos[0].value : null,
          });

          await user.save();
        }
        cb(null, user);
      }
    )
  );
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${API_URL}/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, cb) => {
        let user = await User.find({ profileId: profile.id });
        if (!user.length) {
          user = new User({
            profileId: profile.id,
            bio: profile._json.bio,
            displayName: profile.displayName,
            email: profile._json.email,
            profileImg: profile._json.avatar_url,
          });
          await user.save();
        }
        cb(null, user);
      }
    )
  );
  return passport;
};
