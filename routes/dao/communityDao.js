var mongoose = require('../util/mongodbUtil'),
    Community = mongoose.model('Community'),
    DaoUtil = require('../util/DaoUtil'),
    GeoJSON = mongoose.model('GeoJSON');


var findCommunitiesByDistance = function(centerCoordinates,maxDistanceMeters,callback){
    DaoUtil.find(Community,{loc:{$near: {$geometry: {type: "Point" ,coordinates: centerCoordinates},$maxDistance: maxDistanceMeters}}},callback);
};

var findCommunitiesBySystemRecommend = function(callback){
    DaoUtil.find(Community,{systemRecommendedWeight : {$gt : 0}},callback, {systemRecommendedWeight : -1});
};

var findCommunitiesByName = function (name,callback) {
    DaoUtil.find(Community,{name : new RegExp(name)},callback);
};

var createCommunity = function (name,loc,callback) {
    var community = new Community();
    community.name = name;
    community.loc = new GeoJSON({
        point : {
            type: "Point",
            coordinates: loc
        }
    });
    DaoUtil.insert(community,callback);
};

module.exports = {
    findCommunitiesByDistance : findCommunitiesByDistance,
    findCommunitiesBySystemRecommend : findCommunitiesBySystemRecommend,
    findCommunitiesByName : findCommunitiesByName,
    createCommunity : createCommunity
};