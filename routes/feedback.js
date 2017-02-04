var express= require("express");
var router	= express.Router();
var User 	= require("../models/user");
var Feedback= require("../models/feedback");

router.get('/feedback/new',isLoggedIn,nonAdminfeed,function(req,res){
	res.render("feedback");
});

router.post('/feedback',isLoggedIn,nonAdminfeed,function(req,res){
	//Sanitizing data				
	req.body.newfeed = req.sanitize(req.body.newfeed);
	req.body.webfeed = req.sanitize(req.body.webfeed);
	req.body.quesfeed = req.sanitize(req.body.quesfeed);
	req.body.cfeed = req.sanitize(req.body.cfeed);
	var newfeed =req.body.newfeed;
	var webfeed =req.body.webfeed;
	var quesfeed =req.body.quesfeed;
	var cfeed =req.body.cfeed;
	
	//Imporing Data from form
		var newFeedback={
							newfeed: newfeed,
							webfeed: webfeed,
							quesfeed: quesfeed,
							cfeed: cfeed,
							author:{
									id: req.user._id,
									username: req.user.name
								}
						}

		//creating the comment
		Feedback.create(newFeedback,function(err, newlyCreatedFeedback){
			if(err){
				req.flash("error","Cannot give feedback, Error....Contact admin");
			}
			else{
				res.redirect('/questions');
			}
		});	
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in!!");
	res.redirect("/");
}
function nonAdminfeed(req,res,next){
	if(req.user.username!="admin"){
		return next();
	}
	res.redirect("back");
}
module.exports= router;