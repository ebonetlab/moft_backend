const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const ExtractJWT = jwtStrategy.ExtractJwt;
const postgresql = require('../middleware/model');
const error = require('../logs/error.log');
const config = require('../config/config.json');
const  bcrypt = require('bcrypt');
const saltRounds = 10;


var auth = {
   login: function (req, res) {
        if (! (req.body.username  && req.body.password)) {
            res.status(201).json({
                status: 401,
                message: "Invalid credentials"
            });
            return;
        }
     
    
                if(err)console.error(err);
                req.body.user.email = req.body.username;
                postgresql.findUser(req.body.user).then(user=>{
                bcrypt.compare(req.body.password, user.single_token, function(err, res) {     
                if(err)console.error(err);          
                    if (!res) {
                        res.status(201).json({
                            status: 401,
                            message: "Invalid credentials"
                        });
                        return;
                    }
                    postgresql.updateLastLogin(user.rows[0].email).then(res =>{
                    if(res)console.log(error);
                    
                    postgresql.createLog('/login.amp.html with Single Sign in' + req.body.username).then(response=>{
                        console.log(response);
                    res.status(201).json(usr, req.body.user.single_token);
                    }).catch(error=>console.error(error));
                    })
                    .catch(error=>console.error(error));
                }).catch(error=>console.error(error));
            });  
    
    },
    register: function(req,res){
        if (! (req.body.user.username  && req.body.user.password  &&  req.body.user.first_name && req.body.user.last_name)) {
            res.status(201).json({
                status: 401,
                message: "Invalid credentials"
            });
            return;
        }
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err)console.error(err);
            bcrypt.hash(req.body.user.password, salt, function(err, hash) {
                if(err)console.error(err);
                req.body.user.single_token = hash;
                postgresql.createSingleUser(req.body.user).then(user=>{
                    if (user.rowCount == 0) {
                        res.status(201).json({
                            status: 401,
                            message: "Invalid credentials"
                        });
                        return;
                    }
                    
                    if(res)console.log(error);
                    postgresql.createLog('Register a Single user' + req.body.user.username).then(response=>{
                    res.status(201).json(usr, req.body.user.single_token);
                    }).catch(error=>console.error(error));
                    })
                    .catch(error=>console.error(error));
                }).catch(error=>console.error(error));
        
        });

    }
}


function genToken(user, password) {
    var expires = (typeof config.security.jwt.expirationTime != 'undefined') ? (new Date().getTime() + config.security.jwt.expirationTime) : expiresIn(7);
    var token = {
        token: jwt.sign({"username": user.username, "password": password, "email": user.email, "role": user.role}, config.security.jwt.privateKey, {
            expiresIn: expires,
        })
    }
    delete user.password;
    token.user = user;
    console.log(token);
    return token;
}


function convertWindowsTimeStamp(timestamp) {
    return new Date((timestamp / 10000) - 11644473600000);
}

function expiresIn(days) {
    var dObj = Math.floor(Date.now() / 1000);
    return dObj + config.security.jwt.expirationTime;
}

module.exports = auth;

