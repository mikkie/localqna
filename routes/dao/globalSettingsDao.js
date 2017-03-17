var mongoose = require('../util/mongodbUtil'),
    GlobalSettings = mongoose.model('GlobalSettings'),
    DaoUtil = require('../util/DaoUtil');

var getSettings = function(callback){
    DaoUtil.findOne(GlobalSettings,{},callback);
};

module.exports = {
    getSettings : getSettings
};
