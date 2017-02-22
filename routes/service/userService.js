var userDao = require('../dao/userDao');
var wxBizDataCrypt = require('../util/WXBizDataCrypt');
var conf = require('../conf/conf');
var commonUtil = require('../util/commonUtil');

var createUserIfNotExists = function(wxopenid,callback){
    userDao.findUserByWXopenId(wxopenid,function(user){
        if(!user){
            userDao.createUser(wxopenid,callback);
        }
        else{
            callback(user);
        }
    });
};


var findUserById = function(userId,callback){
    userDao.findUserById(userId,callback);
};

var decrptUserInfo = function (sessionKey,encryptedData,iv,callback) {
   var data = new wxBizDataCrypt(conf.app.appId,sessionKey).decryptData(encryptedData , iv);
   callback(data);
};

var jscode2session = function (code,callback) {
    commonUtil.https.request({
        options : {
            hostname: conf.service.wxApiHost,
            port: 443,
            path: conf.service.jscode2sessionApi.replace('{APPID}',conf.app.appId).replace('{SECRET}',conf.app.appSecret).replace('{JSCODE}',code),
            method: 'GET',
        },
        callback : callback
    });
};

module.exports = {
    createUserIfNotExists : createUserIfNotExists,
    findUserById : findUserById,
    decrptUserInfo : decrptUserInfo,
    jscode2session : jscode2session
};