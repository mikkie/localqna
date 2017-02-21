var express = require('express');
var router = express.Router();
var topicService = require('../service/topicService');
var commonUtil = require('../util/commonUtil');



router.post('/createNewTopic',function (req, res, next) {
    var content = req.body.content;
    var ownerId = req.body.ownerId;
    var communityId = req.body.communityId;
    var communityName = req.body.communityName;
    var expireLength = req.body.expireLength;
    var expireDateUnit = req.body.expireDateUnit;
    if(commonUtil.string.hasEmpty(content)){
        res.json({"error" : "missing params"});
    }
    else{
        topicService.createTopic(content,ownerId,communityId,communityName,expireLength,expireDateUnit,function (doc) {
            res.json({"success" : doc});
        });
    }
});

router.get('/findTopicsByCommunityId',function (req, res, next) {
   var communityId = req.query.communityId;
   if(!communityId){
       res.json({"error" : "missing communityId"});
   }
   else{
       topicService.findTopicsByCommunity(communityId,function(docs){
           res.json({"success" : docs});
       });
   }
});


module.exports = router;