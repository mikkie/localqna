var conf = require('../conf/conf'),
    utf8 = require('utf8'),
    CryptoJS = require("crypto-js"),
    logger = require('../common/logger');

var generateSignature = function(expire){
    var policy = {
        "expiration" : new Date(expire),
        "conditions" : [
            {
                "bucket" : conf.app.ali.bucket
            },
            ["starts-with","$key",conf.app.ali.dir],
            ["content-length-range",1,10485760]
        ]
    };
    var policyJSON = utf8.encode(JSON.stringify(policy));
    var policyBase64 = new Buffer(policyJSON).toString('base64');
    var postSignature = _calcSignature(policyJSON);
    logger.info('policyJSON = ' + policyJSON + ',policyBase64 = ' + policyBase64 + ',postSignature = ' + postSignature);
    return {
        policyBase64 : policyBase64,
        postSignature : postSignature
    };
};

var _calcSignature = function(policyJSON){
    return CryptoJS.HmacSHA1(policyJSON, conf.app.ali.key).toString();
};

module.exports = {
    generateSignature : generateSignature
};