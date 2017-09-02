const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// Creat JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if user ID in teh payload exists
  // If so call done with that user
  // Else call done without user object
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false) }

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
