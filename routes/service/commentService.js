var commentDao = require('../dao/commentDao');
var userDao = require('../dao/userDao');
var commonUtil = require('../util/commonUtil');

var createComment = function (userInfo, content, user, topicId, to, anonymous, callback, errorHandler) {
    var data = {
        userInfo: userInfo,
        content: content,
        owner: user._id,
        topic: topicId,
        to: to,
        anonymous: anonymous
    };
    commentDao.createComment(data, function (comment) {
        if (!comment.error) {
            if (user._id.toString() != comment.owner.id.toString()) {
                var myReplies = user.myReplies;
                var find = false;
                for (var i = 0; i < myReplies.length; i++) {
                    if (myReplies[i].toString() == comment.topic) {
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    userDao.addToMyReplies(user._id, comment.topic, function (res) {
                    });
                }
            }
            callback(comment);
        }
        else {
            errorHandler(comment.error);
        }
    });
};


var findCommentsByTopicId = function (topicId,userId,callback) {
    commentDao.findCommentsByTopicId(topicId, function (comments) {
        var result = [];
        if (comments && comments.length > 0) {
            for (var i in comments) {
                var to = comments[i].to;
                if(to && to.length > 0){
                    var find = false;
                    for(var i in to){
                        if(to[i].toString() == userId.toString()){
                            find = true;
                            break;
                        }
                    }
                    if(!find){
                        continue;
                    }
                }
                comments[i]._doc.createDate = commonUtil.dates.formatTime(comments[i].createDate);
                result.push(comments[i]);
            }
        }
        callback(result);
    });
};

var upOrDownComment = function (commentId, isUp, callback) {
    if (isUp == "true") {
        commentDao.upOrDownComment(commentId, {"up": 1}, callback);
    }
    else {
        commentDao.upOrDownComment(commentId, {"down": 1}, callback);
    }
};

var parseContent = function (content, topic) {
    var toIds = [];
    var filter = {};
    var regex = new RegExp('@' + topic.owner.name);
    if (regex.test(content)) {
        toIds.push(topic.owner.id);
        filter[topic.owner.id.toString()] = true;
    }
    var comments = topic.comments;
    if (comments && comments.length > 0) {
        for (var i = 0; i < comments.length; i++) {
            var idString = comments[i].userId.toString();
            if (filter[idString]) {
                continue;
            }
            if (new RegExp('@' + comments[i].userName).test(content)) {
                toIds.push(comments[i].userId);
                filter[idString] = true;
            }
        }
    }
    return toIds;

};


var deleteComment = function(userId,commentIdStr,callback){
    commentDao.findCommentById(commentIdStr,function(res){
        if(!res.error){
            if(res[0].owner.id.toString() == userId.toString()){
                commentDao.deleteComment(res[0]._id,callback);
            }
            else{
                callback({"401" : "无权限删除该评论"});
            }
        }
        else{
            callback({"error" : "comment not exists"});
        }
    });
};


module.exports = {
    createComment: createComment,
    findCommentsByTopicId: findCommentsByTopicId,
    upOrDownComment: upOrDownComment,
    parseContent: parseContent,
    deleteComment : deleteComment
};