var mongoose = require('../util/mongodbUtil'),
    Comment = mongoose.model('Comment'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;

var createComment = function(data,callback){
    var comment = new Comment();
    comment.content = data.content;
    comment.owner = {
       id : data.owner,
       name : data.userInfo.nickName,
       avatar : data.userInfo.avatarUrl
    };
    comment.anonymous = data.anonymous;
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