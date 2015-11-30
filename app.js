var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var socket_io = require('socket.io');
var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// TWITTER STREAM

var TwitterStreamChannels = require('twitter-stream-channels');

var config = require('./config/config')

var credentials = {
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
}

var client = new TwitterStreamChannels(credentials);

var channels = {
}

var stream = client.streamChannels({track:channels});

function startStreamOne(channel,val){
  stream.on(channel, function(tweet){
    io.emit('one','yes');
    console.log("Contestant one")
  })
}

function startStreamTwo(channel){
  stream.on(channel, function(tweet){
    io.emit('two', 'yes');
    console.log("Contestant Two")
  })
}

io.on('connection', function(socket){
  console.log("a user connected: "+ socket.id);

  channels[socket.id+1] = ['bieber'];
  channels[socket.id+2] = ['trump'];

  console.log(channels)

  socket.on('disconnect', function(){
    console.log("a user disconnected");
  })
})

module.exports = app;
