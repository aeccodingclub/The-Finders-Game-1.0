var express= require("express");
var router	= express.Router();
var Comment = require("../models/comment");
var	Question = require("../models/question");
var User 	= require("../models/user");

router.post('/comment',isLoggedIn,function(req,res){
	//Sanitizing data				
	req.body.text = req.sanitize(req.body.text);
	var text =req.body.text;
	//Imporing Data from form
	if (text != undefined){
		var newComment={
							text: text,
							author:{
									id: req.user._id,
									username: req.user.username
								}
						}

		//creating the comment
		Comment.create(newComment,function(err, newlyCreatedComment){
			if(err){
				req.flash("error","Cannot comment, Error....Contact admin");
			}
			else{
				res.redirect('back');
			}
		});	
	}
	else{
		req.flash("error","At least write something");
		res.redirect('/questions');
	} 
});
//===================delete comments==========================//
router.delete("/comment/:id",isLoggedIn,admin, function(req,res){
	Comment.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error","Cannot delete comment, Check your code");
		}
		else{
			res.redirect("back");
		}
	});
});
//=============================================================//
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in!!");
	res.redirect("/");
}
function admin(req,res,next){
	if(req.user.username==="admin"){
		return next();
	}
	req.flash("error","You dont have permission to do that");
	res.redirect("back");
}
module.exports= router;