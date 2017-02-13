var mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://xx:xx@localhost/localqnaxm');

//define tables

//1.user
var UserSchema = new Schema({
    wxopenid : {type : String, index : true},
    joinDate : { type: Date, default: Date.now },
    starCommunities : [ObjectId],
    starTopics : [ObjectId],
    myTopics : [ObjectId],
    myReplies : [ObjectId],
    notification : [{
        comment : ObjectId,
        readed : Boolean
    }],
    score : { type: Integer, default : 100},
    settings : {

    }
});

//2.Community
var CommunitySchema = new Schema({
    name : { type: String,index : true},
    owner : ObjectId,
    createDate : { type: Date, default: Date.now },
    lat : {type : String},
    lng : {type : String},
    invalid : Boolean
});

//3.Topic
var TopicSchema = new Schema({
    content : {type: String},
    owner : ObjectId,
    community : {
       id : ObjectId,
       name : String
    },
    comments : [ObjectId],
    anonymous : Boolean,
    createDate : { type: Date, default: Date.now },
    hit : Integer
});

//4.Comment
var CommentSchema = new Schema({
    content : {type: String},
    owner : ObjectId,
    topic : ObjectId,
    createDate : { type: Date, default: Date.now },
    anonymous : Boolean,
    up : Integer,
    down : Integer
});


//5.GlobalSettings
var GlobalSettingsSchema = new Schema({

});



mongoose.model('User',UserSchema);


module.exports = mongoose;
