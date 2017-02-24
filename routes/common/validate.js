var logger = require('./logger');

var validate = {
   requirePass : function(res,obj){
       var temp = 'Missing params : ';
       var missing = [];
       for(var k in obj){
           if(!obj[k]){
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