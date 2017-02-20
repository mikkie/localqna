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



var loadIndexPageCommunities = function(loc,res){
    communityService.findTheNearByAndRecommendCommunities(loc,function(docs){
        res.json({"success" : docs});
    });
};

module.exports = router;