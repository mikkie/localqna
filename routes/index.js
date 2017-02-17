var express = require('express');
var router = express.Router();
var communityDao = require('./dao/communityDao');

/* GET home page. */
router.get('/', function(req, res, next) {
  //test
  communityDao.findCommunitiesByDistance([118.783799,31.979234],5000,function(docs){

  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
