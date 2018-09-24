const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Board = require('../models/board');
// Import the List model
const listObject = require('../models/list');
const List = listObject.model;

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

// MAKES AVAILABLE THE CURRENT BOARD INFO
router.param('boardID', (req, res, next, id) => {
  Board.findById(id, (err, board) => {
    if (err) return next(err);
    if (!board) {
      const error = new Error('[ERROR] Board not found');
      error.status = 404;
      return next(error);
    }
    req.board = board;
    next();
  });
});

// MAKE AVAILABLE THE SPECIFIED LIST INFO
router.param('listID', (req, res, next, id) => {
  List.findById(id, (err, list) => {
    if (err) return next(err);
    if (!list) {
      const error = new Error('[ERROR] List not found.');
      error.status = 404;
      return next(error);
    }
    req.list = list;
    next();
  });
});

// GET THE USER PAGE AND RENDERS THE USER'S BOARDS
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


// BOARDS
// RENDERS THE LISTS INSIDE THE BOARD
router.get('/:userID/boards/:boardID', (req, res, next) => {
  // Gets the board info from the database and save it into "req.board"
  // Get the lists
  res.render('boardView', {name: req.user.name, id: req.user._id, title: req.board.title, boardID: req.board._id, lists: req.board.lists})
});

// ADD A NEW LIST INSIDE THE BOARD
router.post('/:userID/boards/:boardID', (req, res, next) => {
  // create a copy of the previous boards array
  const newList = {
    title: req.body.title,
    origin: req.board._id,
    items: []
  }

  // Add a new list to the database
  List.create(newList, (err, list) => {
    if (err) return next(err);
    // Update the board including the reference to the list in it
    Board.findByIdAndUpdate(req.board._id, {$push: {'lists': list}}, {new: true}, (err) => {
      if (err) return next(err);
      return res.redirect(`/users/${req.user._id}/boards/${req.board._id}`);
    });
  });
});


// LISTS
// add a new item into the list
router.post('/:userID/boards/:boardID/:listID', (req, res, next) => {
  const newItem = req.body.item;
  // update the list info pushing the new item into the item array
  List.findByIdAndUpdate(req.list._id, {$push: {'items': newItem}}, {new: true}, (err, list) => {
    if (err) return next(err);

    // update the boards lists with the updated list
    List.find({'origin': req.board._id}, (err, lists) => {
      if (err) return next(err);
      if (!lists) {
        const error = new Error('[ERROR] No Lists found.');
        error.status = 404;
        return next(error);
      }
      // Update the board with the updated lists
      Board.findByIdAndUpdate(req.board._id, {$set: {'lists': lists}}, {new: true}, (err, board) => {
        if (err) return next(err);

        return res.redirect(`/users/${req.user._id}/boards/${req.board._id}`);
      });
    });
  });
});

module.exports = router;