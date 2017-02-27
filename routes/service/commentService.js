var commentDao = require('../dao/commentDao');

var createComment = function(userInfo,content,ownerId,topicId,to,anonymous,callback){
    var data = {
        userInfo : userInfo,
        content : content,
        owner : ownerId,
        topic : topicId,
        to : to,
        anonymous : anonymous
    };
    commentDao.createComment(data,callback);
};


var findCommentsByTopicId = function(topicId,callback){
    commentDao.findCommentsByTopicId(topicId,callback);
};

module.exports = {
    createComment : createComment,
    findCommentsByTopicId : findCommentsByTopicId
};