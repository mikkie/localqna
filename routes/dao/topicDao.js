var mongoose = require('../util/mongodbUtil'),
    Topic = mongoose.model('Topic'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;


var findTopicsByCommunity = function(communityId,callback){
    DaoUtil.find(Topic,{"community.id" : objectID.createFromHexString(communityId)},callback,{createDate:-1});
};

var findTopicsByOwner = function(ownerId,callback){
    DaoUtil.find(Topic,{"owner" : objectID.createFromHexString(ownerId)},callback,{createDate:-1});
};

var createTopic = function(data,callback){
    var topic = new Topic();
    topic.content = data.content;
    topic.owner = objectID.createFromHexString(data.owner);
    topic.community = {
        id : objectID.createFromHexString(data.communityId),
        name : data.communityName
    };
    topic.expireDate = data.expireDate;
    DaoUtil.insert(topic,callback);
};

var findTopicsById = function(id,callback){
    DaoUtil.findByIdOrIds(Topic,id,callback,{createDate:-1});
};

module.exports = {
    createTopic : createTopic,
    findTopicsByCommunity : findTopicsByCommunity,
    findTopicsByOwner : findTopicsByOwner,
    findTopicsById : findTopicsById
};