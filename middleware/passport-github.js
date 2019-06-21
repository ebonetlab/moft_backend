/*  GITHUB AUTH  */

const GitHubStrategy = require('passport-github').Strategy;
require('dotenv').config();
const GITHUB_CLIENT_ID = "your app id"
const GITHUB_CLIENT_SECRET = "your app secret";

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
  });

  let githubRoutes = {
    authenticate: () => {
            return passport.authenticate('github');
        },
    callback: () => {
            return passport.authenticate('github', {
                failureRedirect: '/error'
            });
        }
    }
    export default githubRoutes;