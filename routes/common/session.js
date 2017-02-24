var mongoose = require('../util/mongodbUtil'),
    User = mongoose.model('User'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    conf = require('../conf/conf'),
    common = require('../util/commonUtil'),
    objectID = mongo.ObjectID;

var createSession = function (userId,callback) {
     var sessionId = common.string.guid();
     var expire = new Date(new Date().getTime() + conf.server.session_time_out);
     DaoUtil.findOneAndUpdate(User,{_id : userId},{$set:{"session.id":sessionId,"session.value":{},"session.expire" : expire}},function (user) {
         callback(user.session.id);
     });
};

var getUserSession = function (sessionId,callback) {
    DaoUtil.findOne(User,{"session.id":sessionId},function (user) {
        if(user && user.session && user.session.expire){
           if(user.session.expire.getTime() > new Date().getTime()){
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