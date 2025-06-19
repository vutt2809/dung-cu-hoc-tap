const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const keys = require('./keys');
const { EMAIL_PROVIDER } = require('../constants');
const { User } = require('../models');

const { google, facebook } = keys;

const secret = keys.jwt.secret;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = async app => {
  app.use(passport.initialize());

  await googleAuth();
  await facebookAuth();
};

const googleAuth = async () => {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: google.clientID,
          clientSecret: google.clientSecret,
          callbackURL: google.callbackURL
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await User.findOne({ where: { email: profile.email } });

            if (user) {
              return done(null, user);
            }

            const name = profile.displayName.split(' ');

            const newUser = await User.create({
              provider: EMAIL_PROVIDER.Google,
              googleId: profile.id,
              email: profile.email,
              firstName: name[0],
              lastName: name[1],
              avatar: profile.picture,
              password: null
            });

            return done(null, newUser);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  } catch (error) {
    console.log('Missing google keys');
  }
};

const facebookAuth = async () => {
  try {
    passport.use(
      new FacebookStrategy(
        {
          clientID: facebook.clientID,
          clientSecret: facebook.clientSecret,
          callbackURL: facebook.callbackURL,
          profileFields: [
            'id',
            'displayName',
            'name',
            'emails',
            'picture.type(large)'
          ]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await User.findOne({ where: { facebookId: profile.id } });

            if (user) {
              return done(null, user);
            }

            const newUser = await User.create({
              provider: EMAIL_PROVIDER.Facebook,
              facebookId: profile.id,
              email: profile.emails ? profile.emails[0].value : null,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              avatar: profile.photos[0].value,
              password: null
            });

            return done(null, newUser);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  } catch (error) {
    console.log('Missing facebook keys');
  }
};
