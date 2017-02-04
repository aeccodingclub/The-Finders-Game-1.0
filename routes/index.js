var express= require("express");
var router	= express.Router();
var Question = require("../models/question");
var passport = require('passport');
var User = require("../models/user");
var Feedback= require("../models/feedback");


//=======================================//
router.get('/',function(req,res){
	res.render('home');
});
//====Homepage Routes====//
router.get('/rules',isLoggedIn,function(req,res){
	res.render('rules');
});
router.get('/tools',isLoggedIn,function(req,res){
	res.render('tools');
});
router.get('/youneverknow',isLoggedIn,function(req,res){
	res.render('key');
});

//====Admin page=====//
router.get('/admin',isLoggedIn,admin,function(req,res){
	User.find({},function(err,allusers){
						if(err){
							req.flash("error","Error finding users.... Check your code");
						}
						else{
							Feedback.find({},function(err,allfeedback){
								if(err){
									req.flash("error","Error finding feedback.... Check your code");
								}
								else{
									res.render('admin', {users:allusers, feedback:allfeedback});
								}
							});
						}
					});
});


//===============================Authentication  Routes=========================================//
//Signup
router.post("/register",function(req,res){
	req.body.name = req.sanitize(req.body.name);
	req.body.college = req.sanitize(req.body.college);
	req.body.email = req.sanitize(req.body.email);
	req.body.username = req.sanitize(req.body.username);
	var newUser = new User({
							name:req.body.name,
							college:req.body.college,
							email:req.body.email,
							username: req.body.username
						});

	User.register(newUser,req.body.password,function(err,user){
		if(err){
                req.flash("error",err.message);
                return res.redirect("/");
            }
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to the Game "+ user.username+". Please Go to the RULES page and be thorough with all the rules.");
			res.redirect("/questions");
		});
	});
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/questions",
	failureRedirect:"/"}),
	function(req,res){
});
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!!");
	res.redirect("/");
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
//===============================================================================================//

module.exports= router;


