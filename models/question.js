//Schema setup for Questions
var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
	questiontag:String,
	imagetag:String,
	image:String,
	description:String,
	audio:String,
	video:String,
	answer:String
 });
module.exports = mongoose.model("Question", questionSchema);