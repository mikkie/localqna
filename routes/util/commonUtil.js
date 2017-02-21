var common = {
    string : {
       isAllEmpty : function(){
          if(arguments.length > 0){
              for(var i in arguments){
                 if(arguments[i]){
                     if(typeof arguments[i] === 'string'){
                         arguments[i] = arguments[i].replace(/(^\s*)|(\s*$)/g, "");
                         if(arguments[i].length == 0){
                             continue;
                         }
                     }
                     return false;
                 }
              }
              return true;
          }
          throw new Error('arguments is empty');
       },
       hasEmpty : function(){
           if(arguments.length > 0){
               for(var i in arguments){
                   if(!arguments[i]){
                       return true;
                   }
                   if(typeof arguments[i] === 'string'){
                       arguments[i] = arguments[i].replace(/(^\s*)|(\s*$)/g, "");
                       if(arguments[i].length == 0){
                           return true;
                       }
                   }
               }
               return false;
           }
           throw new Error('arguments is empty');
       }
    }
};

module.exports = common;