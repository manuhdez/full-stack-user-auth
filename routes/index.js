const express = require('express');
const router = express.Router();
const User = require('../models/user');

// HOMEPAGE
// Renders the homepage
router.get('/', (req, res, next) => {
  if (req.session.userID) {
    User.findById({_id: req.session.userID})
        .exec( (err, user) => {
          if (err) {
            const err = new Error('Ups, user not found.');
            err.status = 500;
            return next(err);
          }
          res.render('home', {name: user.name, id: user._id});
        });
  } else {
    res.render('home');
  }
});

// SIGNUP
// Render the signup form to create a new user
router.get('/signup', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) console.error(err);
  })
  res.render('signup');
});

// Sends the form data to mongodb and stores a new user
router.post('/signup', (req, res, next) => {

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    boards: []
  });

  newUser.save((err) => {
    if (err) {
      console.error('User not saved!', err);
    }
    res.redirect('/signup');
  });
});

// LOGIN
// Render the login form
router.get('/login', (req, res, next) => {
  res.render('login');
});

// Get the user data and compare it with the database to authenticate the user
router.post('/login', (req, res, next) => {
  // check if user entered an email and password
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        const err = new Error('[ERROR] Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userID = user._id;
        return res.redirect('/');
      }
    });
  } else {
    const err = new Error('[ERROR] Email and password are required.');
    err.status = 401;
    return next(err);
  }
});


// logout route
router.post('logout')
module.exports = router;