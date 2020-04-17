const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('./keys');
const mongoose = require('mongoose');
const User = require('../models/User');
/*********************************************************** */
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log(profile);

      const newUser = {
        googleID: profile.id,
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        image: profile.picture,
      };

      User.findOne({
        googleID: profile.id
      }).then(user => {
        if (user) {
          // Return user
          done(null, user);
        } else {
          // Create user
          new User(newUser)
            .save()
            .then(user => {
              done(null, user)
            });
        }
      });

    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });


}