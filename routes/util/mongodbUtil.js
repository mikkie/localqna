var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

require('mongoose-geojson-schema');
mongoose.connect('mongodb://localhost/localqnaxm');

//define tables

//1.user
var UserSchema = new Schema({
    wxopenid : {type : String, index : true},
    joinDate : { type: Date, default: Date.now },
    myCommunities : [ObjectId],
    starCommunities : [ObjectId],
    starTopics : [ObjectId],
    myTopics : [ObjectId],
    myReplies : [ObjectId],
    notification : [{
        comment : ObjectId,
        readed : Boolean
    }],
    score : { type: Number, default : 100},
    settings : {

    }
});

//2.Community
var CommunitySchema = new Schema({
    name : { type: String,index : true},
    owner : ObjectId,
    createDate : { type: Date, default: Date.now },
    topics : [ObjectId],
    loc : {type : mongoose.Schema.Types.Point, index : '2dsphere'},
    invalid : {type : Boolean, default : false},
    systemRecommendedWeight : { type: Number, default : 0}
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
    expireDate : { type: Date },
    hit : { type: Number, default : 0},
    fee : { type: Number, default : 0.0},
    score : { type: Number, default : 0}
});

//4.Comment
var CommentSchema = new Schema({
    content : {type: String},
    owner : ObjectId,
    topic : ObjectId,
    to : [ObjectId],
    createDate : { type: Date, default: Date.now },
    anonymous : { type: Boolean, default : false},
    up : { type: Number, default : 0},
    down : { type: Number, default : 0}
});


//5.GlobalSettings
var GlobalSettingsSchema = new Schema({
    topic : {
        topicClosePeriod : { type: Number }
    },
    lbs : {
        maxDistances : {type: Number, default : 5000}
    }
});

mongoose.model('User',UserSchema);
mongoose.model('Community',CommunitySchema);
mongoose.model('Topic',TopicSchema);
mongoose.model('Comment',CommentSchema);
mongoose.model('GlobalSettings',GlobalSettingsSchema);



module.exports = mongoose;
