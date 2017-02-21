var express = require('express');
var router = express.Router();
var commentService = require('../service/commentService');
var commonUtil = require('../util/commonUtil');

router.post('/createNewComment',function (req, res, next) {
    var content = req.body.content;
    var ownerId = req.body.ownerId;
    var topicId = req.body.topicId;
    var to = req.body.to;
    if(commonUtil.string.hasEmpty(content,ownerId,topicId)){
        res.json({"error" : "missing params"});
    }
    else{
        commentService.createComment(content,ownerId,topicId,to,function (doc) {
            res.json({"success" : doc});
        });
    }
});


router.get('/findCommentsByTopicId',function (req, res, next) {
   var topicId = req.query.topicId;
   commentService.findCommentsByTopicId(topicId,function(doc){
       res.json({"success" : doc});
   });
});


module.exports = router;