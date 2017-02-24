var logger = require('./logger'),
    common = require('../util/commonUtil');

var validate = {
   requirePass : function(res,obj){
       var temp = 'Missing params : ';
       var missing = [];
       for(var k in obj){
           if(common.string.isEmpty(obj[k])){
               missing.push(k);
           }
       }
       if(missing.length > 0){
           temp += missing.join(',');
           logger.error(temp);
           res.json({"error" : temp});
           return false;
       }
       return true;
   }
};

module.exports = validate;