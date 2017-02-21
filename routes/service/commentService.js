var commentDao = require('../dao/commentDao');

var createComment = function(content,ownerId,topicId,to,callback){
    var data = {
        content : content,
        owner : ownerId,
        topic : topicId,
        to : to
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