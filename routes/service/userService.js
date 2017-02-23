var userDao = require('../dao/userDao');
var wxBizDataCrypt = require('../util/WXBizDataCrypt');
var conf = require('../conf/conf');
var commonUtil = require('../util/commonUtil');

var login = function(wxopenid,session_key,session,callback){
    var writeSession = function(user){
        var sessionId = commonUtil.string.guid();
        session[sessionId] = {
            userId : user._id,
            wxopenid : wxopenid,
            session_key : session_key
        };
        callback(sessionId);
    };
    userDao.findUserByWXopenId(wxopenid,function(user){
        if(!user){
            userDao.createUser(wxopenid,writeSession);
        }
        else{
            writeSession(user);
        }
    });
};


var getUserId = function(sessionId,session,callback){
    if(session[sessionId]){
        callback(session[sessionId].userId);
    }
    else{
        callback(null);
    }
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
    login : login,
    findUserById : findUserById,
    decrptUserInfo : decrptUserInfo,
    jscode2session : jscode2session,
    getUserId : getUserId
};