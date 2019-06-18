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
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err)console.error(err);
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if(err)console.error(err);
                postgresql.findSingleUser(req.body.username, hash).then(user=>{
                    if (user.rowCount == 0) {
                        res.status(201).json({
                            status: 401,
                            message: "Invalid credentials"
                        });
                        return;
                    }
                    postgresql.updateLastLogin(user.rows[0].email).then(res =>{
                    if(res)console.log(error);
                    
                    postgresql.createLog('/login.amp.html with Single Sign in' + req.body.username).then(response=>{
                    res.status(201).json(genToken(usr, req.body.password));
                    }).catch(error=>console.error(error));
                    })
                    .catch(error=>console.error(error));
                }).catch(error=>console.error(error));
            });
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

