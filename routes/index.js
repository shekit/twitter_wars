var express = require('express');
var router = express.Router();

/* GET home page. */

router.post('/fight', function(req, res, next){
	//render page with the fight scene
	res.render('fight',{'contestantOne':req.body.contestantOne,'contestantTwo':req.body.contestantTwo});
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
