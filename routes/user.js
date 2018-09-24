const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Board = require('../models/board');

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
    Board.find({"author": id}, (err, board) => {
      if (err) return next(err);
      if (!board) return next();
      req.userBoards = board;
      next();
    });
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
  return res.render('profile', {name: req.user.name, id: req.user._id, boards: req.userBoards});
});

// create a new board for a user
router.post('/:userID', (req, res, next) => {
  // get the board data from the user
  const newBoard = {
    title: req.body.boardTitle,
    author: req.user._id,
    lists: []
  };

  Board.create(newBoard, (err) => {
    if (err) return next(err);
    return res.redirect(`/users/${req.user._id}`);
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
  res.render('boardView', {name: req.user.name, id: req.user._id, title: req.board.title, boardID: req.board._id, lists: req.board.lists})
});

// create a new list on the board
router.post('/:userID/boards/:boardID', (req, res, next) => {
  // create a copy of the previous boards array
  let prevBoards = req.user.boards.slice();
  // create an empty array that will hold the updated version of the boards array
  let newBoards = [];
  // Iterate over the boards to push them inside the new boards array and modify the one needed to save the new list
  prevBoards.forEach( board => {
    if (board.title === req.board.title) {
      board.lists.push({title: req.body.title, items: []});
    }
    newBoards.push(board);
  });


  // Updates the boards array in the user data
  User.findByIdAndUpdate(req.user._id, { $set: { "boards": newBoards }}, {new: true}, (err, user) => {
    if (err) return next(err);

    // Redirects to the board view
    res.redirect(`/users/${req.user._id}/boards/${req.board._id}`);
  });
});


// LISTS
// add a new item into the list
router.post('/:userID/boards/:boardID/:listID', (req, res, next) => {
  // save the list into the database
  // redirect to the boardID
  let prevBoards = req.user.boards.slice();
  let newBoards = [];

  console.log('hello im trying to add a new item to a list');

  // iterate each board
  prevBoards.forEach( board => {
    // when the board matches the id of the route run this code
    if (board._id === req.board._id) {
      // iterate the lists to find the current list
      board.lists.map( list => {
        // when the list id equals the :listID param push the new item
        if (list._id === req.params.listID) {
          let newList = list.slice();
          newList.items.push(req.body.item);
          list = newList;
        }
      });
    }

    newBoards.push(board);
  });

  res.json(newBoards);
});


// edit the list and save the changes to the database
// router.put('/:userID/boards/:boardID/:listID', (req, res, next) => {
  // save the new list
  // redirect to the boardID
// });


module.exports = router;