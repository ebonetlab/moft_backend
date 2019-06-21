let express = require('express'),
 router = express.Router(),
postgres = require('../middleware/model'),
auth = require('./auth');
gapi = require('../lib/gapi');
const facebook = require('../middleware/passport-facebook');
const passport = require('passport');
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
   console.log('Verify ' + resp.name);
   if(resp){
  postgres.findUser(resp).then(function(response ){
    if(response){
      console.info('User ' + response.first_name);
    if(response.firstname){   
      console.log(response.first_name +''+ response.last_name);
      if(!resp.email_verified){
      postgres.updateUser(req.body.token).then((rest)=>{
        console.log(rest);
        postgres.createLog('updateUser with Google ' + resp.email);
          res.send(response.email).end();  

        }).catch(err=>{
          console.error(err);
          res.send(err).end();
        });
      }
      postgres.createLog('/login.amp.html with Google ' + resp.email);
        res.send(response.email).end();  
    }
    else{
      postgres.createUser(resp).then((respn)=>{
      console.info(respn);
      res.send(response.email).end();  
      })
      .catch(
        err=>{
          console.error(err);
          res.send(err).end();
        });
        console.log(response);
        postgres.createLog('createUser with Google ' + resp.email);
        res.send(JSON.stringify(response)).end();
      }
    }
    else{
      console.log(response);
      postgres.createLog('/login.amp.html with Google ' + resp.email);
      res.send(JSON.stringify(response)).end();
    }

  });
}
  }).
  catch(err=>{
    console.error(err);
    res.send(JSON.stringify(err.message)).end();
  });
  //next();
});

router.post('/singlesignin', function(req, res, next) {
auth.login(req,res);
//next();
});
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.post('/facesignin', function(req, res, next) {
  facebook.flogin(req,function(err,user){
    if(err)console.error(err);
   res.send(user).end();
});
//next();
});
router.get('/', function(req, res){
  //res.render('index', { user: req.user });
  console.log(req);
  res.status(200).end();
});

router.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});
router.get('/auth/facebook', passport.authenticate('facebook',{scope:["id", "displayName", "photos", "email"]}));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),function(req, res) {
    //res.redirect('/');
    console.log(req);
    res.send(JSON.stringify('Logged in')).end();
  });
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
}); 

/*,function(req, res) {
    // Successful authentication, redirect home.
    console.log(req);
    //res.send(JSON.stringify('login')).end();
    res.redirect('/callbackface');
  });*/
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
   console.log('G. userid: ' + userid );
   console.info('Domain: If request specified a G Suite domain ' + domain);
   (userid) ? resolve(payload) :reject(false) ;
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
