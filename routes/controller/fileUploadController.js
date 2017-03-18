var express = require('express'),
    router = express.Router(),
    conf = require('../conf/conf'),
    fileUploadService = require('../service/fileUploadService');

router.post('/getUploadSignature',function (req, res, next) {
       var expire = new Date().getTime() + conf.app.ali.expire;
       var policyObj = fileUploadService.generateSignature(expire);
       var data = {
           accessid : conf.app.ali.id,
           policy : policyObj.policyBase64,
           signature : policyObj.postSignature,
           dir : conf.app.ali.dir,
           host : 'http://' + conf.app.ali.bucket + '.' + conf.app.ali.endPoint,
           callbackUrl : conf.app.ali.callbackUrl,
           expire : expire
       };
       res.json({"success" : data});
});

module.exports = router;