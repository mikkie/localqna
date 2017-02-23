var logger = require('../common/logger'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;

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

var findOne = function(schema,conditions,callback){
    schema.findOne(conditions).exec(function(err,docs){
        _handleResult(err,docs,callback);
    });
};

var findOneAndUpdate = function (schema,conditions,update,callback) {
    schema.findOneAndUpdate(conditions,update,{new : true},function(err,doc){
        _handleResult(err,doc,callback);
    });
};

var findByIdOrIds = function(schema,idOrIds,callback,sort){
    var condition = '';
    if(idOrIds instanceof Array){
        var idArray = [];
        for(var i = 0;i < idOrIds.length;i++){
            idArray.push(idOrIds[i]);
        }
        condition = {$in : idArray};
    }
    else{
        condition = objectID.createFromHexString(idOrIds)
    }
    find(schema,{_id : condition},callback,sort);
};

var insert = function (data,callback) {
    data.save(function (err,result) {
        _handleResult(err,result,callback);
    });
};


module.exports = {
    find : find,
    findOne : findOne,
    insert : insert,
    findByIdOrIds : findByIdOrIds,
    findOneAndUpdate : findOneAndUpdate
};