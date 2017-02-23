var express = require('express');
var router = express.Router();
var communityService = require('../service/communityService');
var userService = require('../service/userService');
var session = require('../common/session');


router.post('/loadIndexPageCommunities', function(req, res, next) {
    var loc = req.body.location;
    var sessionId = req.body.sessionId;
    if(loc){
        session.getUserSession(sessionId,function (user) {
            if(user){
                loadIndexPageCommunities(loc,user._id,res);
            }
        });
    }
    else{
        res.json({"error" : "loc is empty"});
    }
});

router.post('/findCommunitiesByName',function (req,res,next) {
    var name = req.body.name;
    if(name){
        communityService.findCommunitiesByName(name,function (docs) {
            res.json({"success" : docs});
        });
    }
    else{
        res.json({"error" : "name is empty"});
    }
});


router.post('/createNewCommunity',function (req, res, next) {
    var name = req.body.name;
    var loc = req.body.location;
    if(!name || !loc){
        res.json({"error" : "missing params"});
    }
    else{
        communityService.createCommunity(name,loc,function (doc) {
            res.json({"success" : doc});
        });
    }
});


var loadIndexPageCommunities = function(loc,userId,res){
    communityService.findTheNearByAndRecommendCommunities(loc,userId.toString(),function(docs){
        res.json({"success" : docs});
    });
};

module.exports = router;