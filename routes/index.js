var express = require('express');
var router = express.Router();

/* GET home page. */

router.post('/fight', function(req, res, next){
	res.send(req.body.contestantOne);
})

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
