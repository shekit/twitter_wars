var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


var io = require('socket.io')(5000, {path:'/socket'})
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

var listeners = {};

//enter random word other stream throws an error with empty channel
var channels = {
  "hi":["kabukialal"]
}

var stream;// = client.streamChannels({track:channels});

function reloadStream(){
  console.log("RELOADED STREAM")
  stream = client.streamChannels({track:channels});
}


function startStream(channel,val, socketId, socket){
  console.log("START STREAM")

  // make this a closure so it can access parent function vars
  function processStream(tweet){
    if(val == 'one'){
      io.to(socket).emit('one','yes')
      if(channels[socketId]){
        console.log("Contestant one: "+channels[socketId][0]);
      }
    }
    if(val == 'two'){
      io.to(socket).emit('two','yes')
      if(channels[socketId]){
        console.log("Contestant two: "+channels[socketId][0]);
      }
    }
  }

  stream.on(channel,processStream);

  //create a ref to it in the object so you can remove it later in removeListener
  listeners[socketId] = processStream;
  console.log("TTYPEEEE: "+typeof(listeners[socketId]));
}

function removeStream(channel){
  console.log("REMOVE CHANNEL")
  console.log(channel)
  
  stream.removeListener('channels/'+channel, listeners[channel])
  delete channels[channel];
  console.log(channels);
  // delete listener from obj
  delete listeners[channel];
  console.log("STOP LISTENING")
}



io.on('connection', function(socket){
  console.log("a user connected: "+ socket.id);
  var socketId = socket.id;

  socket.on('contestants', function(msg){
    console.log("GOT CONTESTANTS")
    channels[socketId+'1'] = [msg.contestantOne];
    channels[socketId+'2'] = [msg.contestantTwo];
    console.log(channels)
    reloadStream();
  })

  socket.on('fight', function(msg){
    console.log("START FIGHT")
    // start the stream for the two contestants
    startStream('channels/'+socketId+1, "one",socketId+'1', socketId)
    startStream('channels/'+socketId+2, "two",socketId+'2', socketId)
  })

  socket.on('stop', function(msg){
    console.log("Stop Fight");
    removeStream(socketId+'1', socketId+'1');
    removeStream(socketId+'2', socketId+'2');
  })

  socket.on('disconnect', function(){
    console.log("a user disconnected");
    // do only if user disconnects without stopping fight
    // this will exist only if removestream hasnt been called already
    if(channels[socketId+'1']){
      console.log("FIGHT WAS STILL ON, DO CLEAN UP")
      removeStream(socketId+'1');
      removeStream(socketId+'2');
    }
  })
})



module.exports = app;
