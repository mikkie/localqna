var express = require('express');
var router = express.Router();
var topicService = require('../service/topicService');
var commonUtil = require('../util/commonUtil');
var validate = require('../common/validate');
var session = require('../common/session');
var mongo = require('mongodb'),
    objectID = mongo.ObjectID;



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
            if(!doc.error && !doc["401"]){
                res.json({"success" : doc});
            }
            else{
                res.json(doc);
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


router.get('/getTopicById',function(req, res, next){
    var params = {
        topicId : req.query.topicId,
        sessionId : req.query.sessionId
    };
    if(validate.requirePass(res,params)){
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                topicService.findTopicsById(params.topicId,function(result){
                    if(!result || result.error){
                        res.json({"error" : result.error});
                    }
                    else{
                        if(user._id.toString() == result[0].owner.id.toString()){
                            result[0]._doc.ownByCurrentUser = true;
                        }
                        res.json({"success" : result});
                    }
                });
            }
            else{
                res.json({"error" : "user not exists: " + params.sessionId});
            }
        });
    }
});


router.get('/findTopicsByOwner',function(req, res, next){
    var params = {
        sessionId : req.query.sessionId
    };
    if(validate.requirePass(res,params)){
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                topicService.findTopicsByOwner(user._id,function(docs){
                    res.json({"success" : docs});
                });
            }
            else{
                res.json({"error" : "user not exists sessionId = " + params.sessionId});
            }
        });
    }
});


router.get('/findTopicsNoCommentsNotExpired',function(req, res, next){
    topicService.findTopicsNoCommentsNotExpired(function(docs){
        res.json({"success" : docs});
    });
});


router.post('/deleteTopic',function(req, res, next){
    var params = {
        sessionId : req.body.sessionId,
        topicId : req.body.topicId
    };
    if(validate.requirePass(res,params)){
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                topicService.deleteTopic(user._id,params.topicId,function(result){
                    if(result["401"] || result.error){
                        res.json(result);
                    }
                    else{
                        res.json({"success" : result});
                    }
                });
            }
            else{
                res.json({"error" : "user not exists, sessionId = " + params.sessionId});
            }
        });
    }
});


router.post('/tagTopicReaded',function(req, res, next){
    var params = {
        sessionId : req.body.sessionId,
        topicId : req.body.topicId
    };
    if(validate.requirePass(res,params)){
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                topicService.tagTopicReaded(user._id,params.topicId,function(result){
                    if(result["401"] || result.error){
                        res.json(result);
                    }
                    else{
                        res.json({"success" : result});
                    }
                });
            }
            else{
                res.json({"error" : "user not exists, sessionId = " + params.sessionId});
            }
        });
    }
});


module.exports = router;