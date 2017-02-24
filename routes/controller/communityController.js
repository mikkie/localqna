var express = require('express');
var router = express.Router();
var communityService = require('../service/communityService');
var userService = require('../service/userService');
var session = require('../common/session');
var validate = require('../common/validate');


router.post('/loadIndexPageCommunities', function(req, res, next) {
    var params = {
        loc : req.body.location,
        sessionId : req.body.sessionId
    };
    if(validate.requirePass(res,params)){
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                loadIndexPageCommunities(params.loc,user.starCommunities,res);
            }
            else{
                res.json({"error" : "user not exists: " + params.sessionId});
            }
        });
    }
});

router.post('/findCommunitiesByName',function (req,res,next) {
    var params = {
        name : req.body.name,
        sessionId : req.body.sessionId
    };
    if(validate.requirePass(res,params)){
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                communityService.findCommunitiesByName(params.name,user.starCommunities,function (docs) {
                    res.json({"success" : docs});
                });
            }
            else{
                res.json({"error" : "user not exists: " + params.sessionId});
            }
        });
    }
});


router.post('/createNewCommunity',function (req, res, next) {
    var params = {
        name : req.body.name,
        loc : req.body.location,
        sessionId : req.body.sessionId
    };
    if(validate.requirePass(res,params)){
        communityService.createCommunity(params.name,params.loc,params.sessionId,function (doc) {
            res.json({"success" : doc});
        },function(err){
            res.json({"error" : err});
        });
    }
});


var loadIndexPageCommunities = function(loc,starCommunities,res){
    communityService.findTheNearByAndRecommendCommunities(loc,starCommunities,function(docs){
        res.json({"success" : docs});
    });
};

module.exports = router;