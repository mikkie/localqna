var communityDao = require('../dao/communityDao'),
    userDao = require('../dao/userDao'),
    conf = require('../conf/conf'),
    common = require('../util/commonUtil'),
    Q = require("q"),
    logger = require('../common/logger');


var tagCommunityStar = function (starCommunityIds, communities) {
    if (!starCommunityIds || starCommunityIds.length == 0 || !communities || communities.length == 0) {
        return;
    }
    for (var i in starCommunityIds) {
        for (var j in communities) {
            if (starCommunityIds[i].toString() == communities[j]._id.toString()) {
                communities[j]._doc.star = true;
                continue;
            }
        }
    }
};


var findTheNearByAndRecommendCommunities = function (loc,distance, starCommunities, callback) {
    var res = {
        near: [],
        recommend: []
    };
    Q.allSettled([_findTheNearByCommunities(loc,distance, res), _findRecommendCommunities(res)]).then(function () {
        tagCommunityStar(starCommunities, res.near);
        tagCommunityStar(starCommunities, res.recommend);
        if(res.near.length > 0 && res.recommend.length > 0){
            var newNear = [];
            for(var i in res.recommend){
               var find = false;
               for(var j in res.near){
                   if(res.near[j]._id.toString() == res.recommend[i]._id.toString()){
                       find = true;
                       break;
                   }
               }
               if(!find){
                   newNear.push(res.recommend[i]);
               }
            }
            res.recommend = newNear;
        }
        callback(res);
    });
};

var _findTheNearByCommunities = function (loc,distance, result) {
    var deferred = Q.defer();
    communityDao.findCommunitiesByDistance(loc, distance, function (docs) {
        result.near = docs;
        deferred.resolve();
    });
    return deferred.promise;
};

var _findRecommendCommunities = function (result) {
    var deferred = Q.defer();
    communityDao.findCommunitiesBySystemRecommend(function (docs) {
        result.recommend = docs;
        deferred.resolve();
    });
    return deferred.promise;
};

var findCommunitiesByName = function (name, starCommunities, callback) {
    communityDao.findCommunitiesByName(name, function (res) {
        tagCommunityStar(starCommunities, res);
        callback(res);
    });
};


var createCommunity = function (name, loc, userId, callback, errHandler) {
    var avatar = {
        color: common.color.randomColor(''),
        character: name.substring(0, 1)
    };
    communityDao.findCommunitiesByNameExactly(name,function(res){
        if(res instanceof  Array && res.length > 0){
            callback({"warn" : "社区已存在"});
        }
        else{
            communityDao.createCommunity(name, loc, avatar, function (community) {
                if (community) {
                    userDao.addToMyCommunities(userId, community._id, function(){
                        callback(community);
                    });
                }
                else {
                    var msg = sessionId + ' failed to create community on ' + loc.join(',') + ' name=' + name;
                    logger.error(msg);
                    errHandler(msg);
                }
            });
        }
    });
};

var findStarCommunities = function (ids, callback) {
    communityDao.findCommunitiesById(ids, callback);
};

module.exports = {
    findTheNearByAndRecommendCommunities: findTheNearByAndRecommendCommunities,
    findCommunitiesByName: findCommunitiesByName,
    createCommunity: createCommunity,
    findStarCommunities: findStarCommunities
};