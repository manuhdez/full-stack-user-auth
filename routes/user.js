const express = require('express');
const router = express.Router();

// User Routes
// Render the User Page
router.get('/:userID', (req, res, next) => {
  const user = req.params.userID;
  // res.send(`<h1>Page for the user ${user}</h1>`);
  res.redirect('/login');
});

// create a new board for a user
router.post('/:userID', (req, res, next) => {
  // get the board data
  const boardData = req.body;
  // save the new board on the database inside the users profile
  // redirect to /:userID to see the updated page with the new board
  res.redirect('/:userID');
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