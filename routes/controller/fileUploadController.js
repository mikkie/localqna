var express = require('express'),
    router = express.Router(),
    conf = require('../conf/conf');

router.post('/getUploadSignature',function (req, res, next) {
       var data = {
           accessid : conf.app.ali.id,
           policy : '',
           signature : '',
           dir : conf.app.ali.dir,
           host : 'http://' + conf.app.ali.bucket + '.' + conf.app.ali.endPoint,
           expire : new Date().getTime() + conf.app.ali.expire
       };
       res.json(data);
});

module.exports = router;