var mongoose 				= require('mongoose');
var passportLocalMongoose	= require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	name:String,
	college:String,
	email:String,
	username:String,
	password:String,
	score:[
		 {
			type: mongoose.Schema.Types.ObjectId,
			ref:"Question"
		},
	],
	time:[
			{
				type: Date,
				default:Date.now
			}
	]
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);