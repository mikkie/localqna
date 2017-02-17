var globalSettingsDao = require('../dao/globalSettingsDao'),
    conf = require('../conf/conf'),
    logger = require('../common/logger');

var loadGlobalSettings = function(){
    globalSettingsDao.getSettings(function(doc){
        if(doc){
            _overrideConfSettings(conf.settings,doc);
            logger.info('global settings :' + JSON.stringify(conf.settings));
        }
    });
};

var _overrideConfSettings = function(confSetting,doc){
   for(var k in confSetting){
      if(confSetting[k] instanceof Object){
          _overrideConfSettings(confSetting[k],doc[k]);
      }
      else if(confSetting[k] instanceof Array){
          for(var i in confSetting[k]){
              _overrideConfSettings(confSetting[k][i],doc[k][i]);
          }
      }
      else{
          confSetting[k] = doc[k];
      }
   }
};

module.exports = {
    loadGlobalSettings : loadGlobalSettings
};