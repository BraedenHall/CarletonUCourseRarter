const mongoose = require("mongoose");
const express = require("express");
const Review = require("./reviewModel");
const Subject = require("./subjectModel")

let router = express.Router();

router.get("/:cid", getCourse, sendReviewPage);
router.post("/:cid", express.json(), getCourse, createReview, redirectUser);

function createReview(req,res,next){
	let r = new Review(req.body);
	
	r.course = {};
	r.course.id = res.course._id;
	r.course.code = res.course.code;

	r.save(function(err,result){
		if(err){
			console.log(err);
			return;
		}

		next();
	});
}

function redirectUser(req,res,next){
	res.redirect("/courses/"+res.subCode+"/"+res.cNum);
}

function getCourse(req,res,next){
	let subCode = req.params.cid.slice(0,-4)
	let courseCode = subCode+" "+req.params.cid.slice(-4);

	res.subCode = subCode;
	res.cNum = req.params.cid.slice(-4);

	Subject.findOne({code: new RegExp(subCode, "i")}, function(err, result){
		if(err){
			console.log(err);
			return;
		}

		subject = result.name;
		mongoose.connection.db.collection(subject).findOne({code: new RegExp(courseCode,"i")}, function(err2,course){
			if(err2){
				console.log(err2);
				res.status(500).send("Something happend on our side.");
				return;
			}
	
			res.course = course;
			next();
		});
	});
}

function sendReviewPage(req,res,next){
	res.render("pages/review", {course: res.course});
}

module.exports = router;