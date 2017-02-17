var mongoose = require('../util/mongodbUtil'),
    logger = require('../common/logger'),
    Community = mongoose.model('Community');

var findCommunitiesByDistance = function(centerCoordinates,maxDistanceMeters,callback){
    Community.find({loc:{$near: {$geometry: {type: "Point" ,coordinates: centerCoordinates},$maxDistance: maxDistanceMeters}}},
        function(err,docs){
           if(err){
              logger.error(err);
           }
           else{
              callback(docs);
           }
    });
};

module.exports = {
    findCommunitiesByDistance : findCommunitiesByDistance
};