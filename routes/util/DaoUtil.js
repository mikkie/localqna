var logger = require('../common/logger'),
    mongo = require('mongodb'),
    objectID = mongo.ObjectID;

var _handleResult = function(err,docs,callback){
    if(err){
        logger.error(err);
        if(typeof callback == 'function'){
            callback({error : err});
        }

    }
    else{
        if(typeof callback == 'function') {
            callback(docs);
        }
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

var findByIdAndUpdate = function (schema,id,update,callback) {
    schema.findByIdAndUpdate(id,update,{new : true},function(err,doc){
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

var update = function(schema,condition,update,callback){
    schema.update(condition,update,function (err,result) {
        _handleResult(err,result,callback);
    });
};

var findAll = function(schema,callback,sort){
    find(schema,{},callback,sort);
};


module.exports = {
    find : find,
    findOne : findOne,
    insert : insert,
    findByIdOrIds : findByIdOrIds,
    findOneAndUpdate : findOneAndUpdate,
    findByIdAndUpdate : findByIdAndUpdate,
    update : update,
    findAll : findAll
};