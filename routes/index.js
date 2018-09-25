const express = require('express');
const router = express.Router();
const User = require('../models/user');

// HOMEPAGE
// Renders the homepage
router.get('/', (req, res, next) => {
  if (!req.session.userID) {
    return res.render('home');
  }
  User.findById(req.session.userID)
      .exec( (error, user) => {
        if (error) {
          const err = new Error('Ups, user not found.');
          err.status = 500;
          return next(err);
        }
        return res.render('home', {name: user.name, id: user._id});
      });
});

// SIGNUP
// Render the signup form to create a new user
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

// Sends the form data to mongodb and stores a new user
router.post('/signup', (req, res, next) => {
  // check if all required data is received
  if (req.body.name && req.body.email && req.body.password) {
    // create a new user with the info received
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }

    User.create(newUser, function(error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userID = user._id;
        return res.redirect('/');
      }
    });
  }
});

// LOGIN
// Render the login form
router.get('/login', (req, res, next) => {
  res.render('login');
});

// Get the user data and compare it with the database to authenticate the user
router.post('/login', (req, res, next) => {
  // check if user entered required data
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
router.get('/logout', (req, res, next) => {
  // If a session is active close it
  if (req.session) {
    req.session.destroy( (err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  } else {
    return res.redirect('/');
  }
});

module.exports = router;