var mongoose = require('../util/mongodbUtil'),
    Topic = mongoose.model('Topic'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;


var findTopicsByCommunity = function(communityId,callback){
    DaoUtil.find(Topic,{"community.id" : objectID.createFromHexString(communityId),"expireDate" : {$gt : new Date()},"invalid" : false},callback,{createDate:-1});
};

var findTopicsByOwner = function(ownerId,callback){
    DaoUtil.find(Topic,{"owner.id" : ownerId,"expireDate" : {$gt : new Date()},"invalid" : false},callback,{createDate:-1});
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
    topic.expireLength = data.expireLength;
    topic.expireUnit = data.expireUnit;
    topic.anonymous = data.anonymous;
    topic.images = data.imageUrls;
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
    DaoUtil.find(Topic,{_id : condition,"expireDate" : {$gt : new Date()},"invalid" : false},callback,{createDate:-1});
};


var addComment = function(topicId,update,callback){
    DaoUtil.findByIdAndUpdate(Topic,topicId,{$push : {"comments" : update}},function(){
        DaoUtil.findByIdAndUpdate(Topic,topicId,{$inc : {"newComment" : 1}},callback);
    });
};


var findTopicsNoCommentsNotExpired = function(callback){
    DaoUtil.find(Topic,{"comments" : {$size:0},"expireDate" : {$gt : new Date()},"invalid" : false},callback,{expireDate:1});
};

var deleteTopic = function(topicId,callback){
    DaoUtil.findByIdAndUpdate(Topic,topicId,{"invalid" : true},callback);
};

var tagTopicReaded = function(topicId,callback){
    DaoUtil.findByIdAndUpdate(Topic,topicId,{"newComment" : 0},callback);
};


module.exports = {
    createTopic : createTopic,
    findTopicsByCommunity : findTopicsByCommunity,
    findTopicsByOwner : findTopicsByOwner,
    findTopicsById : findTopicsById,
    addComment : addComment,
    findTopicsNoCommentsNotExpired : findTopicsNoCommentsNotExpired,
    deleteTopic : deleteTopic,
    tagTopicReaded : tagTopicReaded
};