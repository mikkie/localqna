var mongoose = require('../util/mongodbUtil'),
    Topic = mongoose.model('Topic'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;


var findTopicsByCommunity = function(communityId,callback){
    DaoUtil.find(Topic,{"community.id" : objectID.createFromHexString(communityId),"expireDate" : {$gt : new Date()}},callback,{createDate:-1});
};

var findTopicsByOwner = function(ownerId,callback){
    DaoUtil.find(Topic,{"owner.id" : ownerId,"expireDate" : {$gt : new Date()}},callback,{createDate:-1});
};

var createTopic = function(data,callback){
    var topic = new Topic();
    topic.content = data.content;
    topic.owner = {
        id : data.owner,
        name : data.userName,
        avatar : data.avatar
    };
    topic.community = {
        id : objectID.createFromHexString(data.communityId),
        name : data.communityName
    };
    topic.expireDate = data.expireDate;
    topic.anonymous = data.anonymous;
    DaoUtil.insert(topic,callback);
};

var findTopicsById = function(id,callback){
    var condition = {};
    if(id instanceof Array){
        var idArray = [];
        for(var i = 0;i < id.length;i++){
            idArray.push(id[i]);
        }
        condition = {$in : idArray};
    }
    else{
        condition = objectID.createFromHexString(id)
    }
    DaoUtil.find(Topic,{_id : condition,"expireDate" : {$gt : new Date()}},callback,{createDate:-1});
};


var addComment = function(topicId,update,callback){
    DaoUtil.findByIdAndUpdate(Topic,topicId,{$push : {"comments" : update}},callback);
};


var findTopicsOrderByExpireDate = function(callback){
    DaoUtil.findAll(Topic,callback,{expireDate:1});
};

module.exports = {
    createTopic : createTopic,
    findTopicsByCommunity : findTopicsByCommunity,
    findTopicsByOwner : findTopicsByOwner,
    findTopicsById : findTopicsById,
    addComment : addComment,
    findTopicsOrderByExpireDate : findTopicsOrderByExpireDate
};