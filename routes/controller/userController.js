var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var communityService = require('../service/communityService');
var topicService = require('../service/topicService');
var commonUtil = require('../util/commonUtil');
var validate = require('../common/validate');
var session = require('../common/session');

router.get('/findUser', function (req, res, next) {
    var params = {
        sessionId: req.query.sessionId
    };
    if (validate.requirePass(params)) {
        session.getUserSession(params.sessionId, function (user) {
            if (user) {
                res.json({"success": user});
            }
            else {
                res.json({"error": "user not exists, sessionId = " + params.sessionId});
            }
        });
    }
});


router.get('/findStarCommunitiesByOwner', function (req, res, next) {
    var params = {
        sessionId: req.query.sessionId
    };
    if (validate.requirePass(params)) {
        session.getUserSession(params.sessionId, function (user) {
            if (user) {
                var starCommunities = user.starCommunities;
                if (starCommunities && starCommunities.length > 0) {
                    communityService.findStarCommunities(starCommunities, function (docs) {
                        res.json({"success": docs});
                    });
                }
                else{
                    res.json({"success": []});
                }
            }
            else {
                res.json({"error": "user not exists, sessionId = " + params.sessionId});
            }
        });
    }
});

router.get('/findAtmeTopics', function (req, res, next) {
    var params = {
        sessionId: req.query.sessionId
    };
    if (validate.requirePass(params)) {
        session.getUserSession(params.sessionId, function (user) {
            if(user){
                var notifications = user.notification;
                var newNotificationTopics = [];
                if(notifications && notifications.length > 0){
                    for(var i in notifications){
                        if(notifications[i].readed == false && notifications[i].topic){
                            newNotificationTopics.push(notifications[i].topic);
                        }
                    }
                    if(newNotificationTopics.length > 0){
                        topicService.findTopicsById(newNotificationTopics, function (docs) {
                            res.json({"success": docs});
                        });
                    }
                    else{
                        res.json({"success": []});
                    }
                }
                else{
                    res.json({"success": []});
                }
            }
            else{
                res.json({"error": "user not exists, sessionId = " + params.sessionId});
            }
        });
    }
});

router.get('/findUserRepliesTopics', function (req, res, next) {
    var params = {
        sessionId: req.query.sessionId
    };
    if (validate.requirePass(params)) {
        session.getUserSession(params.sessionId, function (user) {
            if(user){
                var myReplies = user.myReplies;
                if (myReplies && myReplies.length > 0) {
                    topicService.findTopicsById(myReplies, function (docs) {
                        res.json({"success": docs});
                    });
                }
                else{
                    res.json({"success": []});
                }
            }
            else{
                res.json({"error": "user not exists, sessionId = " + params.sessionId});
            }
        });
    }
});


router.get('/findStarTopicsByOwner', function (req, res, next) {
    var params = {
        sessionId: req.query.sessionId
    };
    if (validate.requirePass(params)) {
        session.getUserSession(params.sessionId, function (user) {
            if(user){
                var starTopics = user.starTopics;
                if (starTopics && starTopics.length > 0) {
                    topicService.findTopicsById(starTopics, function (docs) {
                        res.json({"success": docs});
                    });
                }
                else{
                    res.json({"success": []});
                }
            }
            else{
                res.json({"error": "user not exists, sessionId = " + params.sessionId});
            }
        });
    }
});


router.post('/login', function (req, res, next) {
    var params = {
        code: req.body.code
    };
    if (validate.requirePass(res, params)) {
        userService.jscode2session(params.code, function (resm) {
            var openId = resm.openid;
            var session_key = resm.session_key;
            if (openId && session_key) {
                userService.login(openId, session_key, function (user) {
                    res.json({"success": {
                        settings : user.settings,
                        sessionId : user.session.id
                    }});
                });
            }
            else {
                res.json({"error": "login fail,can't pass code to session"})
            }
        }, function (err) {
            res.json({"error": 'login fail ' + err});
        });
    }
});

router.post('/createUser', function (req, res, next) {
    var params = {
        openId: req.body.openId,
        session_key: req.body.session_key
    };
    if (validate.requirePass(res, params)) {
        userService.login(params.openId, params.session_key, function (sessionId) {
            res.json({"success": sessionId});
        });
    }
});

router.post('/toggleStarCommunity', function (req, res, next) {
    var params = {
        communityId: req.body.communityId,
        sessionId: req.body.sessionId,
        isAdd: req.body.isAdd
    };
    if (validate.requirePass(res, params)) {
        userService.toggleStarCommunity(params.communityId, params.sessionId, params.isAdd, function (user) {
            if (user) {
                res.json({"success": user});
            }
            else {
                res.json({"error": "user not exists"});
            }
        });
    }
});

router.post('/toggleStarTopics', function (req, res, next) {
    var params = {
        topicId: req.body.topicId,
        sessionId: req.body.sessionId,
        isAdd: req.body.isAdd
    };
    if (validate.requirePass(res, params)) {
        userService.toggleStarTopic(params.topicId, params.sessionId, params.isAdd, function (user) {
            if (user) {
                res.json({"success": user});
            }
            else {
                res.json({"error": "user not exists"});
            }
        });
    }
});


router.post('/updateSettings', function (req, res, next) {
    var params = {
        sessionId: req.body.sessionId
    };
    if (validate.requirePass(res, params)) {
        userService.updateSettings(params.sessionId,req.body.settings,function(result){
            if(result.error){
                res.json({"error": "update user setting failed"});
            }
            else{
                res.json({"success": result});
            }
        });
    }
});

module.exports = router;