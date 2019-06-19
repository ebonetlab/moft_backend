const config = require('../config/config.json');
const postgres = require('./model');
const passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;


let facebook = {
    //Flatan los logs 
flogin: function(req,res){
    console.info('Facebook Login engage');
    //passport.authenticate('facebook', {scope: ['user_friends', 'manage_pages'] });
    passport.use(new FacebookStrategy({
        clientID: config.facebookAuth.clientID,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'],
        enableProof: true
      }, function(accessToken, refreshToken, profile, cb) {
        postgres.findUser(profile.user).then(function(response ){
            if(response.name){
              console.log(response.first_name +''+ response.last_name);
              if(response.email != req.body.user){
              postgres.updateUser(req.body).then((rest)=>{
                console.log(rest);
                console.info(resp);
                return cb(err, user);
                //res.send(response.rows[0].email).end(); 
               
              }).catch(err=>console.error(err));
             }
             else{
            
                console.info(resp);
                res.send(response.rows[0].email).end();  
             }
            }
             else{
              postgres.createUser(req.body).then((respn)=>{
                console.info(respn);
             
              console.info(resp);
              res.send(response.rows[0].email).end();  
        
              }).catch(console.error);
            }
          })
          .catch(err=>console.error(err));
      }
    ));

}
};

module.exports = facebook;