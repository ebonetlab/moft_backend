var express = require('express');
var router = express.Router(),
postgres = require('../middleware/model'),
gapi = require('../lib/gapi');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/tokensigninonserver', function(req, res, next) {
      // Website you wish to allow to connect
      //res.setHeader('Access-Control-Allow-Origin', 'https://moft.eabonet.com');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, x-token, X-Key,application/json,formdata');
  
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      //res.setHeader('Access-Control-Allow-Credentials', true);
      //res.header("Access-Control-Allow-Origin", "*");
      //res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
      //res.header("Access-Control-Allow-Headers", "Content-type, Accept, x-token, X-Key,application/json,formdata");
  console.log(req.body);


  postgres.listUsers().then(function(response ){
    console.log(response.rows[0]);
  verify().catch(console.error);
  res.send('respond with a resource');

  })
  .catch(err=>console.error(err));
 

});




router.get('/oauth2callback', function(req, res, next) {
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
      res.end('<h1>index.jade<h1>', locals);
      next();
 
});

router.get('/cal', function(req, res){
  var locals = {
    title: "These are your calendars",
    user: my_profile.name,
    bday: my_profile.birthday,
    events: my_calendars,
    email: my_email
  };
  res.end('cal.jade', locals);
});
async function verify() {
  const {OAuth2Client} = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CID);
  const ticket = await client.verifyIdToken({
      idToken: req.token,
      audience: GOOGLE_CID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
 

}
module.exports = router;
