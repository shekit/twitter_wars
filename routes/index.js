var express = require('express');
var router = express.Router();
var TwitterStreamChannels = require('twitter-stream-channels');

var config = require('../config/config')

var credentials = {
	consumer_key: config.consumer_key,
	consumer_secret: config.consumer_secret,
	access_token: config.access_token,
	access_token_secret: config.access_token_secret
}

var client = new TwitterStreamChannels(credentials);

var channels = {
	"socketid": ['twitterterm']
}
/* GET home page. */

router.post('/fight', function(req, res, next){
	res.send(req.body.contestantOne);
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
