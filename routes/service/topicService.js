var topicDao = require('../dao/topicDao');
var conf = require('../conf/conf');


var createTopic = function(userInfo,content,sessionId,communityId,communityName,expireLength,expireDateUnit,anonymous,callback){
    session.getUserSession(sessionId,function (user) {
       if(user){
           var data = {
               content : content,
               owner : user._id,
               communityId : communityId,
               communityName : communityName,
               anonymous : anonymous
           };
           var multi = parseInt(expireLength);
           switch(expireDateUnit){
               case 's' : multi = multi * 1000; break;
               case 'm' : multi = multi * 1000 * 60; break;
               case 'h' : multi = multi * 1000 * 3600; break;
               case 'd' : multi = multi * 1000 * 3600 * 24; break;
               default  : ;
           }
           data.expireDate = new Date(new Date().getTime() + (multi));
           if(data.anonymous){
               data.userName = conf.global.anonymousName;
               data.avatar = conf.global.anonymousAvatar;
           }
           else{
               data.userName = userInfo.nickName;
               data.avatar = userInfo.avatarUrl;
           }
           topicDao.createTopic(data,callback);
       }
       else{
           callback({"error" : "user not exists"});
       }
    });
};


var findTopicsByCommunity = function(communityId,callback){
    topicDao.findTopicsByCommunity(communityId,callback);
};

var findTopicsByOwner = function(ownerId,callback){
    topicDao.findTopicsByOwner(ownerId,callback);
};

var findTopicsById = function(ids,callback){
    topicDao.findTopicsById(ids,callback);
};


module.exports = {
    createTopic : createTopic,
    findTopicsByCommunity : findTopicsByCommunity,
    findTopicsByOwner : findTopicsByOwner,
    findTopicsById : findTopicsById
};