var express = require('express');
var router = express.Router();
var topicService = require('../service/topicService');
var commonUtil = require('../util/commonUtil');
var validate = require('../common/validate');
var session = require('../common/session');



router.post('/createNewTopic',function (req, res, next) {
    var params = {
        userInfo : req.body.userInfo,
        content : req.body.content,
        sessionId : req.body.sessionId,
        communityId : req.body.communityId,
        communityName : req.body.communityName,
        expireLength : req.body.expireLength,
        expireDateUnit : req.body.expireDateUnit
    };
    if(validate.requirePass(res,params)){
        topicService.createTopic(params.userInfo,params.content,params.sessionId,params.communityId,params.communityName,params.expireLength,params.expireDateUnit,req.body.anonymous,function (doc) {
            if(!doc.error){
                res.json({"success" : doc});
            }
            else{
                res.json(doc.error);
            }
        });
    }
});

router.get('/findTopicsByCommunityId',function (req, res, next) {
   var params = {
       communityId : req.query.communityId,
       sessionId : req.query.sessionId
   };
   if(validate.requirePass(res,params)){
       session.getUserSession(params.sessionId,function (user) {
           if(user){
               topicService.findTopicsByCommunity(user.starTopics,params.communityId,function(docs){
                   res.json({"success" : docs});
               });
           }
           else{
               res.json({"error" : "user not exists: " + params.sessionId});
           }
       });
   }
});


router.get('/findTopicsByOwner',function(req, res, next){
    var ownerId = req.query.ownerId;
    if(!ownerId){
        res.json({"error" : "missing ownerId"});
    }
    else{
        topicService.findTopicsByOwner(ownerId,function(docs){
            res.json({"success" : docs});
        });
    }
});


module.exports = router;