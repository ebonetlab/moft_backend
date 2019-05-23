//var googleapis = require('../node_modules/googleapis'),
  const {OAuth2Client} = require('google-auth-library');
    //OAuth2Client = googleapis.OAuth2Client,
    client = process.env.GOOGLE_CID,
    secret = process.env.CLIENT_SECRET,
    redirect = 'http://localhost:5000/oauth2callback',
    calendar_auth_url = '',
    oauth2Client = new OAuth2Client(client, secret, redirect);

    const userprofile = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
      });
exports.ping = function() {
    console.log('pong');
};

var callback = function(clients) {
    console.log(clients);
    exports.url = userprofile;
    exports.client = oauth2Client;
    exports.oauth = clients.oauth2;
    exports.client = oauth2Client;
    exports.url = calendar_auth_url;
  }