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
           host : 'https://' + conf.app.ali.bucket + '/' + conf.app.ali.endPoint,
           callbackUrl : conf.app.ali.callbackUrl,
           expire : expire
       };
       res.json({"success" : data});
       //res.json({"success" : {
       //    accessid : '6J9KIFCDZHvqXm4Y',
       //    policy : 'eyJleHBpcmF0aW9uIjoiMjAxNy0wMy0xOFQwOTo0NDowMC4zMjBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJsb2NhbHFuYXhtIl1dfQ==',
       //    signature : 'lyi7n/vtjnw49CPlkvqgfoJ3fSU=',
       //    dir : 'localqnaxm',
       //    host : 'http://yamixed.oss-cn-shenzhen.aliyuncs.com',
       //    callbackUrl : '',
       //    expire : '1489830240000'
       //}});
});

module.exports = router;