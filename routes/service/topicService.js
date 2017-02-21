var topicDao = require('../dao/topicDao');

var createTopic = function(content,ownerId,communityId,communityName,expireLength,expireDateUnit,callback){
    var data = {
        content : content,
        owner : ownerId,
        communityId : communityId,
        communityName : communityName
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
    topicDao.createTopic(data,callback);
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