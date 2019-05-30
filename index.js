var http = require('http');
var express = require('express');
var Session = require('express-session');
var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
const ClientId = process.env.GOOGLE_CID;
const ClientSecret = process.env.CLIENT_SECRET;
const RedirectionUrl = "http://eabonet.com/moft/templates/dashboard.amp.html";

var app = express();
app.use(Session({
    secret: 'raysources-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));

function getOAuthClient() {
    return new OAuth2(ClientId, ClientSecret, RedirectionUrl);
}

function getAuthUrl() {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
        'https://www.googleapis.com/auth/plus.me'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        //use this below to force approval (will generate refresh_token)
        //approval_prompt : 'force'
    });

    return url;
}

app.use("/oauthCallback", function(req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
        console.log("tokens : ", tokens);
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            oauth2Client.setCredentials(tokens);
            session["tokens"] = tokens;
            res.send(`
                <html>
                <body>
                    <h3>Login successful!!</h3>
                    <a href="/details">Go to details page</a>
                <body>
                <html>
            `);
        } else {
            res.send(`
                <html>
                <body>
                    <h3>Login failed!!</h3>
                </body>
                </html>
            `);
        }
    });
});

app.use("/details", function(req, res) {
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(req.session["tokens"]);

    var p = new Promise(function(resolve, reject) {
        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
            console.log("response : ", response);
            resolve(response || err);
        });
    }).then(function(data) {
        res.send(`<html><body>
            <img src=${data.image.url} />
            <h3>Hello ${data.displayName}</h3>
            </body>
            </html>
        `);
    })
});

app.use("/", function(req, res) {
    var url = getAuthUrl();
    res.send(`
        <html>
        <body>
<h1>Authentication using google oAuth</h1>
        <a href=${url}>Login</a>
        </body>
        </html>
    `)
});


var port = 8081;
var server = http.createServer(app);
server.listen(port);
server.on('listening', function() {
    console.log(`listening to ${port}`);
});
