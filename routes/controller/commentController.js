var express = require('express');
var router = express.Router();
var commentService = require('../service/commentService');
var userService = require('../service/userService');
var topicService = require('../service/topicService');
var commonUtil = require('../util/commonUtil');
var validate = require('../common/validate');
var session = require('../common/session');
var conf = require('../conf/conf');


router.post('/createNewComment',function (req, res, next) {
    var params = {
        userInfo : req.body.userInfo,
        content : req.body.content,
        sessionId : req.body.sessionId,
        topicId : req.body.topicId
    };
    if(validate.requirePass(res,params)){
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                if(user.settings.permission && user.settings.permission.community != 'rw'){
                    callback({"401" : "????????????????Tel:" + conf.settings.contact.tel});
                    return;
                }
                commentService.createComment(params.userInfo,params.content,user,params.topicId,req.body.to,req.body.anonymous,function (doc) {
                    res.json({"success" : doc});
                    topicService.addComment(doc,function(topic){
                        if(topic && !topic.error){
                            var to = commentService.parseContent(params.content,topic);
                            if(to && to.length > 0){
                                userService.notifyComment(params.topicId,doc._id,to);
                            }
                        }
                    });
                },function(err){
                    res.json({"error" : err});
                });
            }
            else{
                res.json({"error" : "user not exists sessionId = " + params.sessionId});
            }
        });
    }
});


router.get('/findCommentsByTopicId',function (req, res, next) {
   var params = {
       topicId : req.query.topicId,
       sessionId : req.query.sessionId
   };
   if(validate.requirePass(res,params)){
       session.getUserSession(params.sessionId,function (user) {
           if(user){
               commentService.findCommentsByTopicId(params.topicId,user._id,function(docs){
                   res.json({"success" : docs});
               });
           }
           else{
               res.json({"error" : "user not exists sessionId = " + params.sessionId});
           }
       });
   }
});

router.get('/upOrDownComment',function (req, res, next) {
    var params = {
        commentId : req.query.commentId,
    };
    if(validate.requirePass(res,params)){
        commentService.upOrDownComment(params.commentId,req.query.isUp,function(comment){
            res.json({"success" : comment});
        });
    }
});


module.exports = router;