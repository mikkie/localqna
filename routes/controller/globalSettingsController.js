var express = require('express');
var router = express.Router();
var conf = require('../conf/conf');

router.get('/getGlobalSettings',function (req, res, next) {
    res.json({success : conf});
});

module.exports = router;