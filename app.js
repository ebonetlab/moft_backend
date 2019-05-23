var connect = require('connect');
    app = connect(),
    https = require('https'),
    path = require('path'),
    fs = require('fs'),
    gapi = require('./lib/gapi');
    var my_calendars = [],
    my_profile = {},
    my_email = '';

// gzip/deflate outgoing responses
var compression = require('compression');
app.use(compression());
// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));
// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// respond to all requests
/*app.use(function(req, res){
  res.end('Hello from Connect!\n');
});*/
//create node.js http server and listen on port


  app.use('port', process.env.PORT || 5000);
  app.use('views', __dirname + '/views');
  app.use('view engine', 'jade');

  //app.use(app.router);
//});

app.use('/', function(req, res, next) {
  var locals = {
        title: 'This is my sample app',
        url:gapi.url
      };
  res.end('index.jade', locals);
  next();
});
app.use('/oauth2callback', function(req, res, next) {
  var code = req.originalUrl;
  
  console.log(code);
  gapi.client.getToken(code, function(err, tokens){
    if(err)console.error(err);
    console.log(tokens);
  });
  var locals = {
        title: 'What are you doing with yours?',
        url: gapi.url
      };
      res.end('index.jade', locals);
      next();
 
});

app.use('/oauth2callback', function(req, res) {
   var code = req.originalUrl;
  console.log(code);
  gapi.client.getToken(code, function(err, tokens){
    gapi.client.credentials = tokens;
    getData();
  });
  var locals = {
        title: 'May sample app',
        url: gapi.url
      };
  res.end('index.jade', locals);
});
app.use('/cal', function(req, res){
  var locals = {
    title: "These are your calendars",
    user: my_profile.name,
    bday: my_profile.birthday,
    events: my_calendars,
    email: my_email
  };
  res.end('cal.jade', locals);
});
app.use(function onerror(err, req, res, next) {
  console.info(err);
});

 
 var server =https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
},app).listen(443);
console.log('Express server started on port %s', server.address().port);

var getData = function() {
  gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
      console.log(results);
      my_email = results.email;
      my_profile.name = results.name;
      my_profile.birthday = results.birthday;
  });
  gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
    console.log(results);
    for (var i = results.items.length - 1; i >= 0; i--) {
      my_calendars.push(results.items[i].summary);
    };
  });
};