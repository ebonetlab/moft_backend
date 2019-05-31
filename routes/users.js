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
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-type,Accept, x-token, X-Key,application/json');
  
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      //res.setHeader('Access-Control-Allow-Credentials', true);
      //res.header("Access-Control-Allow-Origin", "*");
      //res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
      //res.header("Access-Control-Allow-Headers", "Content-type, Accept, x-token, X-Key,application/json,formdata");
 

  //Verificar q l user is on db and after update, if not create it!!!!!!
  
  postgres.findUser(req.body.user.U3).then(function(response ){
    if(response.rows.length > 0){
      console.log(response.rows[0].first_name +''+ response.rows[0].last_name);
      if(response.rows[0].email != req.body.user.U3){
      postgres.updateUser(req.body).then((rest)=>{
        verify(req.body.auth.id_token).
        then((resp)=>{
          console.info(resp);
          res.send(response.rows[0].email).end();  
        }).catch(console.error);
      }
      ).catch(err=>console.error(err));
    }
    res.send(response.rows[0].email).end(); 
    }
    else{
      postgres.createUser(req.body).then((respn)=>{
        console.info(respn);
      verify(req.body.auth.id_token).then((resp)=>{
      console.info(resp);
      res.send(response.rows[0].email).end();  
    }).catch(console.error);
      }).catch(console.error);
    }
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
function verify(token) {
  const {OAuth2Client} = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CID);
  client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  }).then((ticket)=>{
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
   console.log(userid);
  })
  .catch(error=>console.error(error));;

  

}
module.exports = router;
