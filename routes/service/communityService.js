var communityDao = require('../dao/communityDao'),
    conf = require('../conf/conf'),
    Q = require("q");


var findTheNearByAndRecommendCommunities = function(loc,callback){
    var res = {
        near : [],
        recommend : []
    };
    Q.allSettled([_findTheNearByCommunities(loc,res.near),_findRecommendCommunities(res.recommend)]).then(function(){
        callback(res);
    });
};

var _findTheNearByCommunities = function(loc,result){
    var deferred = Q.defer();
    communityDao.findCommunitiesByDistance(loc,conf.settings.lbs.maxDistances,function(docs){
        result.push(docs);
        deferred.resolve();
    });
    return deferred.promise;
};

var _findRecommendCommunities = function(result){
    var deferred = Q.defer();
    communityDao.findCommunitiesBySystemRecommend(function(docs){
        result.push(docs);
        deferred.resolve();
    });
    return deferred.promise;
};


module.exports = {
    findTheNearByAndRecommendCommunities : findTheNearByAndRecommendCommunities
};