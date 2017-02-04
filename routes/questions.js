var express = require("express");
var router	= express.Router();
var Question = require("../models/question");
var Comment = require("../models/comment");
var User 	= require("../models/user");


//============================================Questions routes========================================//
router.get('/',isLoggedIn, function(req,res){	
	Question.find({},function(err,allquestions){
		if(err){
			req.flash("error","Error finding question.... Contact admin");
		}
		else{
			Comment.find({},function(err,allcomments){
				if(err){
					req.flash("error","Error finding comments.... Contact admin");
				}
				else{
					User.find({},function(err,allusers){
						if(err){
							req.flash("error","Error finding users.... Contact admin");
						}
						else{
							Question.count({}, function( err, countall){
   						 		res.render('index', {questions: allquestions, comments:allcomments, users:allusers, count:countall});
							});
							
						}
					});
				}
			});
			
		}
	});
});

//=======================CRUD================================//

//====================CREATE ROUTE===========================//
router.post('/',isLoggedIn,admin,function(req,res){
	//Sanitizing data				
	req.body.questiontag = req.sanitize(req.body.questiontag);
	req.body.imagetag = req.sanitize(req.body.imagetag);
	req.body.image = req.sanitize(req.body.image);
	req.body.description = req.sanitize(req.body.description);
	req.body.audio = req.sanitize(req.body.audio);
	req.body.video = req.sanitize(req.body.video);
	req.body.answer = req.sanitize(req.body.answer);
	//importing data to variables
	var questiontag=req.body.questiontag;
	var imagetag=req.body.imagetag;
	var image=req.body.image;
	var description=req.body.description;
	var audio= req.body.audio;
	var video=req.body.video;
	var answer= req.body.answer;
//Imporing Data from form
	var newQuestion={
						questiontag:questiontag, 
						imagetag:imagetag,
						image:image,
						description:description,
						audio:audio,
						video:video,
						answer:answer
					}
	//creating the question
	Question.create(newQuestion,function(err, newlyCreated){
		if(err){
			req.flash("error","Error creating question.... Check your code");
		}
		else{
			req.flash("success","Created a new Question");
			res.redirect('/questions');
		}
	});	
});

router.get('/new',admin,function(req,res){
	res.render("new");
});
//=========================SHOW ROUTE=============================//
router.get("/:id",isLoggedIn,solvedProblems,function(req,res){
	Question.findById(req.params.id,function(err, foundQuestion){
		if(err){
			req.flash("error","Error showing questions.... Contact admin"); 
		}
		else{
			res.render("show", {question: foundQuestion});
		}
	});
});
//=======================EDIT ROUTE======================//
router.get("/:id/edit",isLoggedIn,admin, function(req,res){
	Question.findById(req.params.id, function(err,foundQuestion){
		if(err){
			req.flash("error","Error finding questions to edit.... Check your code");
			res.redirect("/questions/"+foundQuestion._id);
		}
		else{
			res.render("edit",{question: foundQuestion});
		}
	});
});
//=======================UPDATE ROUTE====================//
router.put("/:id",isLoggedIn,admin, function(req,res){
	//Sanitizing data				
	req.body.questiontag = req.sanitize(req.body.questiontag);
	req.body.imagetag = req.sanitize(req.body.imagetag);
	req.body.image = req.sanitize(req.body.image);
	req.body.description = req.sanitize(req.body.description);
	req.body.audio = req.sanitize(req.body.audio);
	req.body.video = req.sanitize(req.body.video);
	req.body.answer = req.sanitize(req.body.answer);
	//Update the question
	Question.findByIdAndUpdate(req.params.id,req.body, function(err, updatedQuestion){
		if(err){
			req.flash("error","Error updating question.... Check your code");
			res.redirect("/questions");
		}
		else{
			res.redirect("/questions/"+ req.params.id); 
		}
	});
});
//=========================DELETE ROUTE===================//
router.delete("/:id",isLoggedIn,admin, function(req,res){
	Question.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error","Error deleting question.... Check your code");
			res.redirect("/questions/edit");
		}
		else{
			req.flash("success","Successfully deleted a question");
			res.redirect("/questions");
		}
	});
});
//==============================end of CRUD==================//


//===========Compare answer==============//
router.post("/:id",isLoggedIn,nonAdmin,solvedProblems,function(req,res){
	req.body.ans = req.sanitize(req.body.ans);
	var ans= req.body.ans;
	Question.findById(req.params.id,function(err, foundQuestion){
		if(err){
			req.flash("error","Error finding question to compare answer.... Contact admin");
				}
		else{
				if(ans===foundQuestion.answer) 
				{
					
					User.findById(req.user._id,function(err, updatedUser){
						if(err){
							req.flash("error","Error updating id in solved array.... Contact admin");
							res.redirect("/questions/"+ req.params.id);
						}
						else{
							var soltime=Date.now();
							updatedUser.time.push(soltime);
							updatedUser.score.push(req.params.id);
							updatedUser.save(function(err,data){
								if (err){
									req.flash("error","Error pushing id in array.... Contact admin");
								}	else{
									console.log("correct answer and updated date and time");
								}
							});
							req.flash("success","Bingo!!!--Correct Answer");
							res.redirect("/questions"); 
						}
					});
					
				}
				else
				{
					req.flash("error","Wrong Answer");
					res.redirect("back");
				}
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
function admin(req,res,next){
	if(req.user.username==="admin"){
		return next();
	}
	req.flash("error","You dont have permission to do that");
	res.redirect("back");
}
function nonAdmin(req,res,next){
	if(req.user.username!="admin"){
		return next();
	}
	res.redirect("back");
}
function solvedProblems(req,res,next){
var s=req.user.score;
var len=s.length;
var a = s.indexOf(req.params.id);
if (a!=-1 && len!=0){
					req.flash("success","You have already solved that question");
					res.redirect("/questions");
					}
if (a==-1 || len==0){					
					return next();
}}
					
module.exports= router;