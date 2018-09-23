const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Add middleware to be able to acces the user data whenever the url includes the user id
router.param("userID", (req, res, next, id) => {
  User.findById(id, (err, doc) => {
    if (err) return next(err);
    if (!doc) {
      const err = new Error('User Not Found.');
      err.status = 404;
      return next(err);
    }
    req.user = doc;
    return next();
  });
});

router.param('boardID', (req, res, next, id) => {
  req.board = req.user.boards.id(id);
  if (!req.board) {
    const err = new Error('Board Not Found.');
    err.status = 404;
    return next(err);
  }
  return next();
});

// User Routes
// Render the User Page
router.get('/:userID', (req, res, next) => {
  return res.render('profile', {name: req.user.name, id: req.user._id, boards: req.user.boards});
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
  console.log(req.board)
  // Renders every list of the board
  res.render('boardView', {name: req.user.name, id: req.user._id, title: req.board.title, boardID: req.board._id, lists: req.board.lists})
});

// create a new list on the board
router.post('/:userID/boards/:boardID', (req, res, next) => {
  const boardID = req.board._id;
  const newList = req.body.title;
  console.log(newList);
  // Saves the new list to the database
  User.findByIdAndUpdate(req.user._id, { $push: { "boards.boardID.lists": newList }}, {new: true}, (err, user) => {
    if (err) return next(err);

    res.redirect(`/users/${req.user._id}/boards/${req.board._id}`);
  });
  // Redirects to the board view
});


// LISTS
// create a new list item
// router.post('/:userID/boards/:boardID/:listID', (req, res, next) => {
  // save the list into the database
  // redirect to the boardID
// });

// edit the list and save the changes to the database
// router.put('/:userID/boards/:boardID/:listID', (req, res, next) => {
  // save the new list
  // redirect to the boardID
// });


module.exports = router;