var mongoose = require('../util/mongodbUtil'),
    Community = mongoose.model('Community'),
    DaoUtil = require('../util/DaoUtil');

var findCommunitiesByDistance = function(centerCoordinates,maxDistanceMeters,callback){
    DaoUtil.find(Community,{loc:{$near: {$geometry: {type: "Point" ,coordinates: centerCoordinates},$maxDistance: maxDistanceMeters}}},callback);
};

var findCommunitiesBySystemRecommend = function(callback){
    DaoUtil.find(Community,{systemRecommendedWeight : {$gt : 0}},callback, {systemRecommendedWeight : -1});
};

module.exports = {
    findCommunitiesByDistance : findCommunitiesByDistance,
    findCommunitiesBySystemRecommend : findCommunitiesBySystemRecommend
};