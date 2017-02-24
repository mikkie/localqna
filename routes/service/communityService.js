var communityDao = require('../dao/communityDao'),
    userDao = require('../dao/userDao'),
    conf = require('../conf/conf'),
    common = require('../util/commonUtil'),
    Q = require("q"),
    logger = require('../common/logger');


var tagCommunityStar = function(starCommunityIds,communities){
    if(!starCommunityIds || starCommunityIds.length == 0 || !communities || communities.length == 0){
        return;
    }
    for(var i in starCommunityIds){
       for(var j in communities){
           if(starCommunityIds[i].toString() == communities[j]._id.toString()){
               communities[j].star = true;
               continue;
           }
       }
    }
};


var findTheNearByAndRecommendCommunities = function(loc,userId,callback){
    var res = {
        near : [],
        recommend : []
    };
    Q.allSettled([_findTheNearByCommunities(loc,res),_findRecommendCommunities(res)]).then(function(){
        userDao.findUserById(userId,function(user){
            if(user){
                var starCommunity = user.starCommunities;
                tagCommunityStar(starCommunity,res.near);
                tagCommunityStar(starCommunity,res.recommend);
                callback(res);
            }
        });

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


var createCommunity = function(name,loc,sessionId,callback,errHandler) {
    var avatar = {
        color : common.color.randomColor(''),
        character : name.substring(0,1)
    };
    communityDao.createCommunity(name,loc,avatar,function(community){
        if(community){
            userDao.addToMyCommunities(sessionId,community._id,callback);
        }
        else{
            var msg = sessionId + ' failed to create community on ' + loc.join(',') + ' name=' + name;
            logger.error(msg);
            errHandler(msg);
        }
    });
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