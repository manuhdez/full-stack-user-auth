const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view setting setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// app routes
app.get('/', (req, res) => {
  res.send('hello world!');
});

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  const err = new Error('File not found');
  err.status = 404;
  return next(err);
})

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