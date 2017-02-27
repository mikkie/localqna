var commentDao = require('../dao/commentDao');
var userDao = require('../dao/userDao');
var commonUtil = require('../util/commonUtil');

var createComment = function(userInfo,content,user,topicId,to,anonymous,callback,errorHandler){
    var data = {
        userInfo : userInfo,
        content : content,
        owner : user._id,
        topic : topicId,
        to : to,
        anonymous : anonymous
    };
    commentDao.createComment(data,function(comment){
        if(!comment.error){
            var myReplies = user.myReplies;
            var find = false;
            for(var i = 0; i < myReplies.length; i++){
                if(myReplies[i].toString() == comment.topic){
                   find = true;
                   break;
                }
            }
            if(!find){
                userDao.addToMyReplies(user._id,comment.topic,function(res){
                });
            }
            callback(comment);
        }
        else{
            errorHandler(comment.error);
        }
    });
};


var findCommentsByTopicId = function(topicId,callback){
    commentDao.findCommentsByTopicId(topicId,function(comments){
        if(comments && comments.length > 0){
            for(var i in comments){
                comments[i]._doc.createDate = commonUtil.dates.formatTime(comments[i].createDate);
            }
        }
        callback(comments);
    });
};

module.exports = {
    createComment : createComment,
    findCommentsByTopicId : findCommentsByTopicId
};