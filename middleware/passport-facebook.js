
const config = require('../config/config.json');
const postgres = require('./model');
const passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

let facebook = {
    //Flatan los logs 
flogin: function(req,callback){
    console.info('Facebook Login engage with '+ process.env.FACEBOOK_CLIENT_ID);
    console.info('callbackURL: '+ config.facebookAuth.callbackURL);
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: config.facebookAuth.callbackURL,
        profileFields: config.facebookAuth.profileFields,
        enableProof: true
      }, function(accessToken, refreshToken, profile, cb) {
          console.log(accessToken);
          console.log(refreshToken);
        postgres.findUser(profile.user).then(function(response ){
            if(response.name){
              console.log(response.first_name +''+ response.last_name);
              if(response.email != req.body.user){
              postgres.updateUser(req.body).then((rest)=>{
                console.log(rest);
                console.info(resp);
                callback(err, user);
                
               
              }).catch(err=>console.error(err));
             }
             else{
            
                console.info(resp);
                res.send(response.email).end();  
             }
            }
             else{
              postgres.createUser(req.body).then((respn)=>{
                   
              console.info(respn);
              callback(respn);  
        
              }).catch(console.error);
            }
          })
          .catch(err=>console.error(err));
      })
      
      );

}
};

module.exports = facebook;