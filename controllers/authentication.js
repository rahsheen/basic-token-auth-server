const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

const tokenForUser = user => {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = (req, res, next) => {
  // User already verified, just needs token
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(422)
      .send({ error: 'Both email and password required' })
  }

  // See if a user with a given email exists
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) { return next(err) }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' })
    }

    const user = new User({ email, password })

    user.save(err => {
      if (err) { return next(err) }

      res.json({ token: tokenForUser(user) })
    })
  })
}
