const express = require('express');
const router = express.Router();
const User = require('../models/user');

// HOMEPAGE
// Renders the homepage
router.get('/', (req, res, next) => {
  res.send('<h1>Home page</h1>');
});

// SIGNUP
// Render the signup form to create a new user
router.get('/signup', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) console.error(err);
    users.forEach( user => console.log(user));
  })
  res.send('<h1>Singup form</h1>');
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
      console.error('User not saved!');
    }
  });

  res.redirect('/signup');
});

// LOGIN
// Render the login form
router.get('/login', (req, res, next) => {
  res.send('<h1>login form</h1>');
});

// Get the user data and compare it with the database to authenticate the user
router.post('/login', (req, res, next) => {
  res.json(req.body);
});

module.exports = router;