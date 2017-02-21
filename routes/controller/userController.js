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


module.exports = router;