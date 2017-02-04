
var express			= require('express');
var app				= express();
var bodyParser 		= require('body-parser');
var methodOverride	= require('method-override');
var mongoose		= require('mongoose');
var flash			= require('connect-flash');
var passport		= require('passport');
var LocalStrategy	= require('passport-local');
var expressSanitizer= require('express-sanitizer');
var Question 		= require('./models/question');
var User 			= require("./models/user");
var Comment			= require("./models/comment");
var Feedback		= require("./models/feedback");

var questionRoutes	= require("./routes/questions");
var indexRoutes		= require("./routes/index");
var commentRoutes	= require("./routes/comment");
var feedbackRoutes	= require("./routes/feedback");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/questionsdb");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static(__dirname+"/public")); 
app.use(methodOverride("_method"));
app.use(flash());

//===============Passport config==============//
app.use(require("express-session")({
	secret: "You NEVER Know",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/questions",questionRoutes);
app.use(commentRoutes);
app.use(feedbackRoutes);
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
