const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view setting setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Database connection
mongoose.connect('mongodb://localhost:27017/trelloClone', {useNewUrlParser: true});
const db = mongoose.connection;

// database event listeners
// if database connection fails
db.on('error', (err) => {
  console.error('[ERROR] Database unable to connect', err);
});

// user session handler
app.use(session({
  secret: 'Thanks to trello',
  resave: true,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: db
  })
}));


// app routes
const homeRoutes = require('./routes/index');
const usersRoutes = require('./routes/user');
app.use('/', homeRoutes);
app.use('/users', usersRoutes);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  const err = new Error('File not found');
  err.status = 404;
  return next(err);
});

// error handler
app.use( (err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// port setup
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});