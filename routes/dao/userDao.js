var mongoose = require('../util/mongodbUtil'),
    User = mongoose.model('User'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;


var createUser = function(wxopenid,callback){
    var user = new User();
    user.wxopenid = wxopenid;
    DaoUtil.insert(user,callback);
};

var findUserById = function(userId,callback){
    DaoUtil.findOne(User,{_id : objectID.createFromHexString(userId)},callback);
};

var findUserByWXopenId = function(wxopenid,callback){
    DaoUtil.findOne(User,{wxopenid : wxopenid},callback);
};

var addToMyCommunities = function(sessionId,communityId,callback){
    DaoUtil.findOneAndUpdate(User,{"session.id" : sessionId},{$push: {"myCommunities": communityId,"starCommunities": communityId}},callback);
};

var addToStarCommunities = function (userId,communityId,callback) {
    DaoUtil.findByIdAndUpdate(User,userId,{$push: {"starCommunities": objectID.createFromHexString(communityId)}},callback);
};

var removeStarCommunities = function (userId,communityId,callback) {
    DaoUtil.findByIdAndUpdate(User,userId,{$pull: {"starCommunities": objectID.createFromHexString(communityId)}},callback);
};

var addToStarTopics = function(userId,topicId,callback){
    DaoUtil.findOneAndUpdate(User,userId,{$push: {"starTopics": objectID.createFromHexString(topicId)}},callback);
};

var removeStarTopics = function (userId,topicId,callback) {
    DaoUtil.findByIdAndUpdate(User,userId,{$pull: {"starTopics": objectID.createFromHexString(topicId)}},callback);
};

var addToMyReplies = function(userId,topicId,callback){
    DaoUtil.findOneAndUpdate(User,userId,{$push: {"myReplies": topicId}},callback);
};


module.exports = {
    createUser : createUser,
    findUserById : findUserById,
    findUserByWXopenId : findUserByWXopenId,
    addToMyCommunities : addToMyCommunities,
    addToStarCommunities : addToStarCommunities,
    removeStarCommunities : removeStarCommunities,
    addToStarTopics : addToStarTopics,
    removeStarTopics : removeStarTopics,
    addToMyReplies : addToMyReplies
};