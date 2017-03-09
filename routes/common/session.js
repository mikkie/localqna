var mongoose = require('../util/mongodbUtil'),
    User = mongoose.model('User'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    conf = require('../conf/conf'),
    common = require('../util/commonUtil'),
    logger = require('./logger'),
    objectID = mongo.ObjectID;

var createSession = function (userId,callback) {
     var sessionId = common.string.guid();
     var expire = new Date(new Date().getTime() + conf.server.session_time_out);
     DaoUtil.findOneAndUpdate(User,{_id : userId},{$set:{"session.id":sessionId,"session.value":{},"session.expire" : expire}},function (user) {
         callback(user);
     });
};

var getUserSession = function (sessionId,callback) {
    DaoUtil.findOne(User,{"session.id":sessionId},function (user) {
        if(!user || user.error){
           logger.error('user not exists, sessionId = ' + sessionId);
           callback(null);
           return;
        }
        else if(user.session && user.session.expire){
           if(user.session.expire.getTime() > new Date().getTime()){
               logger.warn('user session expired, sessionId = ' + sessionId);
               callback(user);
               return;
           }
        }
        callback(null);
    });
};


module.exports = {
    createSession : createSession,
    getUserSession : getUserSession
};