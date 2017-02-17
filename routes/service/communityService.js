var communityDao = require('../dao/communityDao'),
    conf = require('../conf/conf');


var findTheNearByAndRecommendCommunities = function(loc,callback){
    communityDao.findCommunitiesByDistance(loc,conf.settings.lbs.maxDistances,callback);
    communityDao.findCommunitiesBySystemRecommend(callback);
};


module.exports = {
    findTheNearByAndRecommendCommunities : findTheNearByAndRecommendCommunities
};