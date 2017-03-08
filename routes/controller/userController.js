var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var communityService = require('../service/communityService');
var topicService = require('../service/topicService');
var commonUtil = require('../util/commonUtil');
var validate = require('../common/validate');
var session = require('../common/session');
var logger = require('../common/logger');

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
                var exists = {};
                if(notifications && notifications.length > 0){
                    for(var i in notifications){
                        if(notifications[i].readed == false && notifications[i].topic){
                            if(!exists[notifications[i].topic.toString()]){
                                newNotificationTopics.push(notifications[i].topic);
                                exists[notifications[i].topic.toString()] = true;
                            }
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
            if (openId) {
                userService.login(openId, function (user) {
                    logger.info('user login success: sessionId= ' + user.session.id);
                    res.json({"success": {
                        settings : user.settings,
                        sessionId : user.session.id
                    }});
                });
            }
            else {
                var error = "login fail,can't pass code to session, code = " + params.code;
                logger.error(error);
                res.json({"error": error})
            }
        }, function (err) {
            var error = 'login fail ' + err;
            res.json({"error": error});
        });
    }
});

//!!this api is for internal use only
router.post('/createUser', function (req, res, next) {
    var params = {
        openId: req.body.openId
    };
    if (validate.requirePass(res, params)) {
        userService.login(params.openId, function (sessionId) {
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
                res.json({"error": "update user setting failed " + result.error});
            }
            else{
                res.json({"success": result});
            }
        });
    }
});

module.exports = router;