const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Board = require('../models/board');

// User Routes
// Render the User Page
router.get('/:userID', (req, res, next) => {
  // Find user data in mongo
  User.findById(req.session.userID)
    .exec( (error, user) => {
      if (error) {
        const err = new Error('Ups, we couldn\'t find the user');
        err.status = 500;
        return next(err);
      } else {
        // Pass the boards to the profile template to render
        return res.render('profile', {name: user.name, id: user._id, boards: user.boards});
      }
    });
});

// create a new board for a user
router.post('/:userID', (req, res, next) => {
  // get the board data from the user
  const newBoardList = [{
    title: req.body.boardTitle,
    lists: []
  }];

  // Push the new board to the users boards array
  User.findByIdAndUpdate(req.session.userID, { $push: { boards: newBoardList}}, {new: true}, function(err, user) {
    if (err) return next(err);
    // redirect to /:userID to see the updated page with the new board
    res.redirect('/users/' + req.session.userID);
  });

});

// update the board info (name)
router.put('/:userID', (req, res, next) => {
  // get the board data
  const boardData = req.body;
  // get the board from the database
  // replace it with the new name
  // save the new board name on the database
  // redirect to /:userID to see the updated page with the new board
  res.redirect('/:userID');
});

// BOARDS
// render the board content
router.get('/:userID/boards/:boardID', (req, res, next) => {
  // Gets the board info from the database
  // Renders every list of the board
  res.json(req.params)
});

// create a new list on the board
router.post('/:userID/boards/:boardID', (req, res, next) => {
  // Saves the new list to the database
  // Redirects to the board view
});


// LISTS
// create a new list item
router.post('/:userID/boards/:boardID/:listID', (req, res, next) => {
  // save the list into the database
  // redirect to the boardID
});

// edit the list and save the changes to the database
router.put('/:userID/boards/:boardID/:listID', (req, res, next) => {
  // save the new list
  // redirect to the boardID
});


module.exports = router;