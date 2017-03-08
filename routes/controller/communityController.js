var express = require('express');
var router = express.Router();
var communityService = require('../service/communityService');
var userService = require('../service/userService');
var session = require('../common/session');
var validate = require('../common/validate');
var conf = require('../conf/conf');


router.post('/loadIndexPageCommunities', function(req, res, next) {
    var params = {
        location : req.body.location,
        sessionId : req.body.sessionId,
        distance : req.body.distance
    };
    if(validate.requirePass(res,params)){
        if(isNaN(params.distance) || parseInt(params.distance) > conf.global.maxDistance){
            res.json({"error" : "distance shoud be number and less than " + conf.global.maxDistance + 'KM'});
            return;
        }
        if(!(params.location instanceof Array) || params.location.length != 2 || isNaN(params.location[0]) || isNaN(params.location[1])){
            res.json({"error" : "location shoud be array of [longtitude,latitude]"});
            return;
        }
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                loadIndexPageCommunities(params.location,parseInt(params.distance) * 1000,user.starCommunities,res);
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
        location : req.body.location,
        sessionId : req.body.sessionId
    };
    if(validate.requirePass(res,params)){
        if(!(params.location instanceof Array) || params.location.length != 2 || isNaN(params.location[0]) || isNaN(params.location[1])){
            res.json({"error" : "location shoud be array of [longtitude,latitude]"});
            return;
        }
        session.getUserSession(params.sessionId,function (user) {
            if(user){
                communityService.createCommunity(params.name,params.location,user._id,function (doc) {
                    res.json({"success" : doc});
                },function(err){
                    res.json({"error" : err});
                });
            }
            else{
                res.json({"error" : "user not exists: " + params.sessionId});
            }
        });
    }
});


var loadIndexPageCommunities = function(loc,distance,starCommunities,res){
    communityService.findTheNearByAndRecommendCommunities(loc,distance,starCommunities,function(docs){
        res.json({"success" : docs});
    });
};

module.exports = router;