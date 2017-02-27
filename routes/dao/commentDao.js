var mongoose = require('../util/mongodbUtil'),
    Comment = mongoose.model('Comment'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID,
    conf = require('../conf/conf');

var createComment = function(data,callback){
    var comment = new Comment();
    comment.content = data.content;
    comment.owner = {
       id : data.owner
    };
    comment.anonymous = data.anonymous;
    if(comment.anonymous){
        comment.owner.name = conf.global.anonymousName;
        comment.owner.avatar = conf.global.anonymousAvatar;
    }
    else{
        comment.owner.name = data.userInfo.nickName;
        comment.owner.avatar = data.userInfo.avatarUrl;
    }
    comment.topic = objectID.createFromHexString(data.topic);
    if(data.to && data.to.length > 0){
        var toArray = [];
        for(var i in data.to){
            toArray.push(objectID.createFromHexString(data.to[i]));
            comment.to = toArray;
        }
    }
    DaoUtil.insert(comment,callback);
};


var findCommentsByTopicId = function(topicId,callback){
    DaoUtil.find(Comment,{topic : objectID.createFromHexString(topicId)},callback,{createDate : -1});
};


module.exports = {
    createComment : createComment,
    findCommentsByTopicId : findCommentsByTopicId
};