var communityDao = require('../dao/communityDao'),
    conf = require('../conf/conf'),
    Q = require("q");


var findTheNearByAndRecommendCommunities = function(loc,callback){
    var result = [];
    Q.allSettled([findTheNearByCommunities(loc,result),findRecommendCommunities(result)]).then(function(result){
        callback(result);
    });
};

var findTheNearByCommunities = function(loc,result){
    var deferred = Q.defer();
    communityDao.findCommunitiesByDistance(loc,conf.settings.lbs.maxDistances,function(docs){
        result.push(docs);
        deferred.resolve();
    });
    return deferred.promise;
};

var findRecommendCommunities = function(result){
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