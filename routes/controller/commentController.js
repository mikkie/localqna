var express = require('express');
var router = express.Router();
var commentService = require('../service/commentService');
var commonUtil = require('../util/commonUtil');
var validate = require('../common/validate');
var session = require('../common/session');

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
                commentService.createComment(params.userInfo,params.content,user,params.topicId,req.body.to,req.body.anonymous,function (doc) {
                    res.json({"success" : doc});
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
       topicId : req.query.topicId
   };
   if(validate.requirePass(res,params)){
       commentService.findCommentsByTopicId(params.topicId,function(doc){
           res.json({"success" : doc});
       });
   }
});


module.exports = router;