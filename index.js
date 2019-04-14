// Main starting point of application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const router = require('./router');

const app = express();

// Database setup
mongoose.connect('mongodb://localhost:auth/auth', {
  useNewUrlParser: true,
  useCreateIndex: true
});

// App Setup
// config express
// morgan and body parser are middleware in express

// every incoming request is passed to morgan and body-parser
// morgan is logging framework (mostly used for debugging)
// body parser parses requests to json
// nodemon watches for file changes and restart server after changes

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

router(app);

// Server Setup
// express to talk to outside world
const port = process.env.PORT || 3090;

// create http server who knows how to receive request and forward it to app
const server = http.createServer(app);

server.listen(port);
console.log('Server listening on: ', port);