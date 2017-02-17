var express = require('express');
var router = express.Router();
var communityService = require('../service/communityService');


router.post('/loadIndexPageCommunities', function(req, res, next) {
    var loc = req.body.location;
    if(loc){
        loadIndexPageCommunities(loc,res);
    }
    else{
        res.json({"error" : "loc is empty"});
    }
});

var loadIndexPageCommunities = function(loc,res){
    communityService.findTheNearByAndRecommendCommunities(loc,function(docs){
        res.json({"success" : docs});
    });
};

module.exports = router;