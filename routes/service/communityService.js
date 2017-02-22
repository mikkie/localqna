var communityDao = require('../dao/communityDao'),
    conf = require('../conf/conf'),
    common = require('../util/commonUtil'),
    Q = require("q");


var findTheNearByAndRecommendCommunities = function(loc,callback){
    var res = {
        near : [],
        recommend : []
    };
    Q.allSettled([_findTheNearByCommunities(loc,res),_findRecommendCommunities(res)]).then(function(){
        callback(res);
    });
};

var _findTheNearByCommunities = function(loc,result){
    var deferred = Q.defer();
    communityDao.findCommunitiesByDistance(loc,conf.settings.lbs.maxDistances,function(docs){
        result.near = docs;
        deferred.resolve();
    });
    return deferred.promise;
};

var _findRecommendCommunities = function(result){
    var deferred = Q.defer();
    communityDao.findCommunitiesBySystemRecommend(function(docs){
        result.recommend = docs;
        deferred.resolve();
    });
    return deferred.promise;
};

var findCommunitiesByName = function (name,callback) {
    communityDao.findCommunitiesByName(name,callback);
};


var createCommunity = function(name,loc, callback) {
    var avatar = {
        color : common.color.randomColor(''),
        character : name.substring(0,1)
    };
    communityDao.createCommunity(name,loc,avatar,callback);
};

var findStarCommunities = function(ids,callback){
    communityDao.findCommunitiesById(ids,callback);
};

module.exports = {
    findTheNearByAndRecommendCommunities : findTheNearByAndRecommendCommunities,
    findCommunitiesByName : findCommunitiesByName,
    createCommunity : createCommunity,
    findStarCommunities : findStarCommunities
};