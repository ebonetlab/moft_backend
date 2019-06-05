const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const ExtractJWT = jwtStrategy.ExtractJwt;
const postgresql = require('../middleware/database.js');
const validateReq = require('../middleware/validateREquest');
const error = require('../logs/error.log');
const config = require('../config/config.json');


var auth = {
    login: function (req, res) {
        if (req.body.username == '' || req.body.password == '') {
            res.status(201).json({
                status: 401,
                message: "Invalid credentials"
            });
            return;
        }
        auth.validate(req, function (user) {
            if (!user) {
                res.status(201).json({
                    status: 401,
                    message: "Invalid credentials"
                });
                return;
            }
            var usr =user;
			console.log(user.memberOf);
            postgresql.exec("SELECT * FROM `users` WHERE `username` LIKE '" + usr.username + "'", null, function (user) {
                postgresql.exec("SELECT MAX(DATE_FORMAT(`lastLogin`, '%Y-%m-%d %H:%i:%s')) `lastLogin` FROM `userlog` WHERE `username` LIKE '" + usr.username + "'", null, function (idlogs) {
                    if (idlogs.length !== 0) {usr['userid'] = user[0]['idusers']; usr['lastLogin'] = idlogs[0]['lastLogin'];}
                    postgresql.exec("INSERT INTO `userlog`(`username`, `lastlogin`) VALUES ('"+ usr.username + "', NOW())", null, function (r) {
                        res.status(201).json(genToken(usr, req.body.password));
                    });
                });
            });
        });

    },
    validate: function (req, next) {
      //  console.log(req);
        passport.authenticate('ldapauth', {session: false}, function (err, user) {
            console.log(user);
            if (err) {
                error.log(err, config.system.debugLevel, 'aderror.log');
                return next(err);
            }
            return next(user);
        })(req, next);
    },
    validateUser: function (token, next) {
        var req = {body: {username: token.username, password: token.password}}
        passport.authenticate('ldapauth', {session: false}, function (err, user) {
            if (err) {
                error.log(err, config.system.debugLevel, 'aderror.log');
                return next(err);
            }
            return next(user);
        })(req, next);
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

