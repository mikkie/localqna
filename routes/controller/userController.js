var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var communityService = require('../service/communityService');
var topicService = require('../service/topicService');
var commonUtil = require('../util/commonUtil');
var validate = require('../common/validate');


router.get('/findStarCommunitiesByOwner', function (req, res, next) {
    var ownerId = req.query.ownerId;
    if (!ownerId) {
        res.json({"error": "missing ownerId"});
    }
    else {
        userService.findUserById(ownerId, function (doc) {
            if (doc) {
                var starCommunities = doc.starCommunities;
                if (starCommunities && starCommunities.length > 0) {
                    communityService.findStarCommunities(starCommunities, function (docs) {
                        res.json({"success": docs});
                    });

                }
            }
        });
    }
});


router.get('/findUserRepliesTopics', function (req, res, next) {
    var ownerId = req.query.ownerId;
    if (!ownerId) {
        res.json({"error": "missing ownerId"});
    }
    else {
        userService.findUserById(ownerId, function (doc) {
            if (doc) {
                var myReplies = doc.myReplies;
                if (myReplies && myReplies.length > 0) {
                    topicService.findTopicsById(myReplies, function (docs) {
                        res.json({"success": docs});
                    });
                }
            }
        });
    }
});


router.get('/findStarTopicsByOwner', function (req, res, next) {
    var ownerId = req.query.ownerId;
    if (!ownerId) {
        res.json({"error": "missing ownerId"});
    }
    else {
        userService.findUserById(ownerId, function (doc) {
            if (doc) {
                var starTopics = doc.starTopics;
                if (starTopics && starTopics.length > 0) {
                    topicService.findTopicsById(starTopics, function (docs) {
                        res.json({"success": docs});
                    });
                }
            }
        });
    }
});


router.post('/login', function (req, res, next) {
    var params = {
        code: req.body.code
    };
    if(validate.requirePass(res,params)){
        userService.jscode2session(params.code, function (resm) {
            var openId = resm.openid;
            var session_key = resm.session_key;
            if(openId && session_key){
                userService.login(openId, session_key, function (sessionId) {
                    res.json({"success": sessionId});
                });
            }
            else{
                res.json({"error": "login fail,can't pass code to session"})
            }
        },function(err){
            res.json({"error": 'login fail ' + err});
        });
    }
});

router.post('/createUser', function (req, res, next) {
    var params = {
        openId: req.body.openId,
        session_key : req.body.session_key
    };
    if(validate.requirePass(res,params)){
        userService.login(params.openId, params.session_key, function (sessionId) {
            res.json({"success": sessionId});
        });
    }
});

module.exports = router;