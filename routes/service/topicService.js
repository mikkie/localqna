var topicDao = require('../dao/topicDao');
var conf = require('../conf/conf');
var session = require('../common/session');
var commonUtil = require('../util/commonUtil');


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

var tagStarTopics = function(starTopics, topics){
    if(!topics || topics.length == 0){
        return;
    }
    var tag = (!starTopics || starTopics.length == 0);
    for (var i in topics) {
        topics[i]._doc.createDate = commonUtil.dates.formatTime(topics[i].createDate);
        if(!tag){
            for (var j in starTopics) {
                if (starTopics[j].toString() == topics[i]._id.toString()) {
                    topics[i]._doc.star = true;
                    continue;
                }
            }
        }
    }
};

var findTopicsByCommunity = function(starTopics,communityId,callback){
    topicDao.findTopicsByCommunity(communityId,function(topics){
        tagStarTopics(starTopics,topics);
        callback(topics);
    });
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