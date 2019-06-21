'use strict';
import passport from 'passport';
import {
    Strategy as TwitterStrategy
} from 'passport-twitter';
require('dotenv').config();
import auth from 'app/config/auth';
import Service from 'app/helper/Service';
passport.use(new TwitterStrategy({
        consumerKey: auth.twitter.client_id,
        consumerSecret: auth.twitter.client_secret,
        callbackURL: auth.twitter.callback_url,
        passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
let data = profile._json;
let user='';
 let email = `${user}">data.screen_name@twitter.com`;
        Service.user.registerSocial({
                provider: 'twitter',
                name: data.name,
                email: email,
                profile_picture: data.profile_image_url,
                meta: {
                    provider: 'twitter',
                    id: data.id,
                    token: accessToken,
                    screen_name: data.screen_name,
                }
            },
            done
        );
}
));
let TwitterRoutes = {
authenticate: () => {
        return passport.authenticate('twitter');
    },
callback: () => {
        return passport.authenticate('twitter', {
            failureRedirect: '/auth/failed'
        });
    }
}
export default TwitterRoutes;