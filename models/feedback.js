var mongoose= require('mongoose');

var feedbackSchema = mongoose.Schema({
	newfeed: String,
	webfeed: String,
	quesfeed: String,
	cfeed: String,
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	}

});

module.exports= mongoose.model("Feedback", feedbackSchema);