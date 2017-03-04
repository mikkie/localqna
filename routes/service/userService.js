var userDao = require('../dao/userDao');
var wxBizDataCrypt = require('../util/WXBizDataCrypt');
var conf = require('../conf/conf');
var commonUtil = require('../util/commonUtil');
var session = require('../common/session');
var extend = require('extend');
var mongo = require('mongodb'),
    objectID = mongo.ObjectID;

var login = function(wxopenid,session_key,callback){
    var writeSession = function(user){
        session.createSession(user._id,callback);
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

var jscode2session = function (code,callback,erroHandler) {
    commonUtil.https.request({
        options : {
            hostname: conf.service.wxApiHost,
            port: 443,
            path: conf.service.jscode2sessionApi.replace('{APPID}',conf.app.appId).replace('{SECRET}',conf.app.appSecret).replace('{JSCODE}',code),
            method: 'GET',
        },
        callback : callback,
        erroHandler : erroHandler
    });
};

var toggleStarCommunity = function (communityId,sessionId,isAdd,callback) {
    isAdd = (isAdd == 'true' ? true : false);
    session.getUserSession(sessionId,function (user) {
        if(user){
            var find = false;
            var starCommunities = user.starCommunities;
            if(starCommunities && starCommunities.length > 0){
               for(var i in starCommunities){
                  if(starCommunities[i].toString() == communityId){
                      find = true;
                      break;
                  }
               }
            }
            if(!(isAdd ^ find)){
                callback(user);
            }
            else if(isAdd){
                userDao.addToStarCommunities(user._id,communityId,callback);
            }
            else{
                userDao.removeStarCommunities(user._id,communityId,callback);
            }
        }
        else{
            callback(null);
        }
    });
};


var toggleStarTopic = function (topicId,sessionId,isAdd,callback) {
    isAdd = (isAdd == 'true' ? true : false);
    session.getUserSession(sessionId,function (user) {
        if(user){
            var find = false;
            var starTopics = user.starTopics;
            if(starTopics && starTopics.length > 0){
                for(var i in starTopics){
                    if(starTopics[i].toString() == topicId){
                        find = true;
                        break;
                    }
                }
            }
            if(!(isAdd ^ find)){
                callback(user);
            }
            else if(isAdd){
                userDao.addToStarTopics(user._id,topicId,callback);
            }
            else{
                userDao.removeStarTopics(user._id,topicId,callback);
            }
        }
        else{
            callback(null);
        }
    });
};


var notifyComment = function(topicId,commentId,to){
    if(to && to.length > 0){
       userDao.addNotifications(objectID.createFromHexString(topicId),to,commentId);
    }
};

var updateSettings = function(sessionId,settings,callback){
    session.getUserSession(sessionId,function (user) {
        if(user){
            var newSettings = extend(true,user.settings.toObject(),settings);
            userDao.updateSettings(sessionId,newSettings,function(res){
                if(res.error){
                    callback({error : res.error});
                }
                else{
                    callback(newSettings);
                }
            });
        }
        else{
            callback({error : "user not exists"});
        }
    });
};

module.exports = {
    login : login,
    findUserById : findUserById,
    decrptUserInfo : decrptUserInfo,
    jscode2session : jscode2session,
    getUserId : getUserId,
    toggleStarCommunity : toggleStarCommunity,
    toggleStarTopic : toggleStarTopic,
    notifyComment : notifyComment,
    updateSettings : updateSettings
};