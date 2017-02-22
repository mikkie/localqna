var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var communityService = require('../service/communityService');
var topicService = require('../service/topicService');
var commonUtil = require('../util/commonUtil');


router.post('/createUser',function (req, res, next) {
    var wxopenid = req.body.wxopenid;
    if(!wxopenid){
        res.json({"error" : "missing wxopenid"});
    }
    else{
        userService.createUser(wxopenid,function (doc) {
            res.json({"success" : doc});
        });
    }
});


router.get('/findStarCommunitiesByOwner',function(req,res,next){
    var ownerId = req.query.ownerId;
    if(!ownerId){
        res.json({"error" : "missing ownerId"});
    }
    else{
        userService.findUserById(ownerId,function(doc){
            if(doc){
                var starCommunities = doc.starCommunities;
                if(starCommunities && starCommunities.length > 0){
                    communityService.findStarCommunities(starCommunities,function(docs){
                        res.json({"success" : docs});
                    });

                }
            }
        });
    }
});


router.get('/findUserRepliesTopics',function(req,res,next){
    var ownerId = req.query.ownerId;
    if(!ownerId){
        res.json({"error" : "missing ownerId"});
    }
    else{
        userService.findUserById(ownerId,function(doc){
            if(doc){
                var myReplies = doc.myReplies;
                if(myReplies && myReplies.length > 0){
                    topicService.findTopicsById(myReplies,function(docs){
                        res.json({"success" : docs});
                    });
                }
            }
        });
    }
});


router.get('/findStarTopicsByOwner',function(req,res,next){
    var ownerId = req.query.ownerId;
    if(!ownerId){
        res.json({"error" : "missing ownerId"});
    }
    else{
        userService.findUserById(ownerId,function(doc){
            if(doc){
                var starTopics = doc.starTopics;
                if(starTopics && starTopics.length > 0){
                    topicService.findTopicsById(starTopics,function(docs){
                        res.json({"success" : docs});
                    });
                }
            }
        });
    }
});


router.post('/decrptUserInfo',function (req,res,next) {
   var code = req.body.code;
   var encryptedData = req.body.encryptedData;
   var iv = req.body.iv;
   if(commonUtil.string.hasEmpty(code,encryptedData,iv)){
       res.json({"error" : "missing params"});
   }
   else{
       userService.jscode2session(code,function (resm) {
           var openId = resm.openid;
           var session_key = resm.session_key;
           userService.createUserIfNotExists(openId,function(user){
              //todo

           });
           userService.decrptUserInfo(session_key,encryptedData,iv,function (result) {
               res.json({"success" : result});
           });
       });
   }
});


module.exports = router;