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
    DaoUtil.find(Community,{name : new RegExp(name),invalid : false},callback);
};

var createCommunity = function (name,loc,avatar,callback) {
    var community = new Community();
    community.name = name;
    community.loc = {
        type: "Point",
        coordinates: loc
    };
    community.avatar = avatar;
    DaoUtil.insert(community,callback);
};


var findCommunitiesById = function(id,callback){
    DaoUtil.findByIdOrIds(Community,id,callback,{createDate:-1});
};

module.exports = {
    findCommunitiesByDistance : findCommunitiesByDistance,
    findCommunitiesBySystemRecommend : findCommunitiesBySystemRecommend,
    findCommunitiesByName : findCommunitiesByName,
    createCommunity : createCommunity,
    findCommunitiesById : findCommunitiesById
};