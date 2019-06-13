var express = require('express');
var router = express.Router(),
postgres = require('../middleware/model'),
//auth = require('./auth');
gapi = require('../lib/gapi');


 /*GET home page. */
/*router.get('/users', function(req, res, next) {
  res.render('users', { title: 'Moft Users' });
  res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-type, Accept, x-token, X-Key");
      if (req.method == 'OPTIONS') {
        res.status(200).end();
    
    } else {
        next();
    }
});*/

router.post('/tokensigninonserver', function(req, res, next) {

 console.info(`New request by ${req.body.token}`);
 verify(req.body.token).then((resp)=>{
   if(resp){
  postgres.findUser(req.body.token).then(function(response ){
    if(response){
    if(response.rows.length > 0){   
      console.log(response.rows[0].first_name +''+ response.rows[0].last_name);
      postgres.updateUser(req.body.token).then((rest)=>{
        console.log(rest);
          res.send(response.rows[0].email).end();  
        }).catch(err=>{
          console.error(err);
          res.send(err).end();
        });
    }
    else{
      
      postgres.createUser(resp).then((respn)=>{
      console.info(respn);
      res.send(response.rows[0].email).end();  
      }).
      catch(
        err=>{
          console.error(err);
          res.send(err).end();
        });
      }
    }
    else{
      console.log(response);
      res.send(JSON.stringify(response)).end();
    }

  });
}
  }).
  catch(err=>{
    console.error(err);
    res.send(JSON.stringify(err.message)).end();
  });
});
router.post('/singlesignin', function(req, res, next) {
auth.validateUser();
});
router.post('/facesignin', function(req, res, next) {

  postgres.findUser(req.body.user.U3).then(function(response ){
    if(response.rows.length > 0){
      console.log(response.rows[0].first_name +''+ response.rows[0].last_name);
      if(response.rows[0].email != req.body.user.U3){
      postgres.updateUser(req.body).then((rest)=>{
        console.log(rest);
        verify(req.body.auth.id_token).then((resp)=>{
          console.info(resp);
          res.send(response.rows[0].email).end();  
        }).catch(err=>console.error(err));

      }).catch(err=>console.error(err));
     }
     else{
      verify(req.body.auth.id_token).then((resp)=>{
        console.info(resp);
        res.send(response.rows[0].email).end();  
      }).catch(err=>console.error(err));
     }
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
  return new Promise((resolve, reject) => {
  client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  }).then((ticket)=>{
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    const domain = payload['hd'];
   console.log('G. userid' + userid );
   console.info('Domain: If request specified a G Suite domain ' + domain);
   (userid) ? resolve(true) :reject(false) ;
  })
  .catch(
    error=>
    {
      console.error(error);
      reject(error);
    }
    );
  });
  }
module.exports = router;
