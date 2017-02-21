var mongoose = require('../util/mongodbUtil'),
    Topic = mongoose.model('Topic'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;


var findTopicsByCommunity = function(communityId,callback){
    DaoUtil.find(Topic,{"community.id" : objectID.createFromHexString(communityId)},callback,{createDate:-1});
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

module.exports = {
    createTopic : createTopic,
    findTopicsByCommunity : findTopicsByCommunity
};