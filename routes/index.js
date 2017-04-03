var express = require('express');
var router = express.Router();
var path = require('path');
var fs= require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Linda' });
});

router.get('/fC9IXuyuXm.txt', function(req, res, next) {
    fs.readFile(path.join(__dirname,'wx','fC9IXuyuXm.txt'),function(err,data){
        res.writeHead(200,{'content-type':'text/plain'});
        res.end(data.toString());
    });
});

module.exports = router;
