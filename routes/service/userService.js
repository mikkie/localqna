var userDao = require('../dao/userDao');

var createUser = function(wxopenid,callback){
    userDao.createUser(wxopenid,callback);
};


var findUserById = function(userId,callback){
    userDao.findUserById(userId,callback);
};

module.exports = {
    createUser : createUser,
    findUserById : findUserById
};