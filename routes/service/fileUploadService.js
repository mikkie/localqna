var conf = require('../conf/conf'),
    hmac = require('../fileupload/hmac.js'),
    sha1 = require('../fileupload/sha1.js'),
    Base64 = require("../fileupload/Base64"),
    Crypto = require('../fileupload/crypto'),
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
    var policyJSON = JSON.stringify(policy);
    var policyBase64 = Base64.encode(policyJSON);
    var postSignature = _calcSignature(policyBase64);
    logger.info('policyJSON = ' + policyJSON + ',policyBase64 = ' + policyBase64 + ',postSignature = ' + postSignature);
    return {
        policyBase64 : policyBase64,
        postSignature : postSignature
    };
};

var _calcSignature = function(policyBase64){
    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, conf.app.ali.key, {
        asBytes: true
    });
    return Crypto.util.bytesToBase64(bytes);
};

module.exports = {
    generateSignature : generateSignature
};