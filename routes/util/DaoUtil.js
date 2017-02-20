var logger = require('../common/logger');

var _handleResult = function(err,docs,callback){
    if(err){
        logger.error(err);
    }
    else{
        callback(docs);
    }
};

var find = function(schema,conditions,callback,sort){
    var find = schema.find(conditions);
    if(sort){
       find = find.sort(sort);
    }
    find.exec(function(err,docs){
        _handleResult(err,docs,callback);
    });
};

var findOne = function(schema,conditions,callback,sort){
    var find = schema.findOne(conditions);
    if(sort){
        find.sort(sort);
    }
    find.exec(function(err,docs){
        _handleResult(err,docs,callback);
    });
};

var insert = function (data,callback) {
    data.save(function (err,result) {
        _handleResult(err,result,callback);
    });
};


module.exports = {
    find : find,
    findOne : findOne,
    insert : insert
};