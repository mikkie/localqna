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


module.exports = {
    createUser : createUser,
    findUserById : findUserById,
    findUserByWXopenId : findUserByWXopenId,
    addToMyCommunities : addToMyCommunities
};