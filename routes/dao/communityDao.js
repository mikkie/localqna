var mongoose = require('../util/mongodbUtil'),
    Community = mongoose.model('Community'),
    DaoUtil = require('../util/DaoUtil'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;

var findCommunitiesByDistance = function(centerCoordinates,maxDistanceMeters,callback){
    DaoUtil.find(Community,{loc:{$near: {$geometry: {type: "Point" ,coordinates: centerCoordinates},$maxDistance: maxDistanceMeters}},invalid : false},callback);
};

var findCommunitiesBySystemRecommend = function(callback){
    DaoUtil.find(Community,{systemRecommendedWeight : {$gt : 0},invalid : false},callback, {systemRecommendedWeight : -1});
};

var findCommunitiesByName = function (name,callback) {
    DaoUtil.find(Community,{name : new RegExp(name,'i'),invalid : false},callback);
};

var findCommunitiesByNameExactly = function (name,callback) {
    DaoUtil.find(Community,{name : name,invalid : false},callback);
};

var createCommunity = function (userId,name,loc,avatar,permission,callback) {
    var community = new Community();
    community.owner = userId;
    community.name = name;
    community.loc = {
        type: "Point",
        coordinates: loc
    };
    community.avatar = avatar;
    if(permission){
        community.permission = permission;
    }
    DaoUtil.insert(community,callback);
};


var findCommunitiesByIds = function(ids,callback){
    DaoUtil.find(Community,{_id : {$in : ids},invalid : false},callback,{createDate:-1});
};

var findCommunitiesById = function(id,callback){
    DaoUtil.findByIdOrIds(Community,id,callback);
};

module.exports = {
    findCommunitiesByDistance : findCommunitiesByDistance,
    findCommunitiesBySystemRecommend : findCommunitiesBySystemRecommend,
    findCommunitiesByName : findCommunitiesByName,
    findCommunitiesByNameExactly : findCommunitiesByNameExactly,
    createCommunity : createCommunity,
    findCommunitiesByIds : findCommunitiesByIds,
    findCommunitiesById : findCommunitiesById
};