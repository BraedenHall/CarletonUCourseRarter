const mongoose = require("mongoose");
const express = require("express");
const Course = require("./courseModel");
const Review = require("./reviewModel");
const Subject = require("./subjectModel")


let router = express.Router();

router.get("/:sid", loadCourses, sendCourses);

router.get("/:sid/:cid", getCourse, findReviews, sendCourse);

function findReviews(req,res,next){
	let c = {};
	c.id = res.course._id;
	c.code = res.course.code;

	Review.find().where({course: c}).exec(function(err,result){
		if(err){
			console.log(err);
			return;
		}

		console.log(result);
		res.reviews = result;
		next();
	});
}

function getCourse(req,res,next){
	let courseCode = req.params.sid + " " + req.params.cid;

	Subject.findOne({code: new RegExp(req.params.sid, "i")}, function(err, result){
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

function sendCourse(req,res,next){
	res.format({
		"text/html": () => { res.render("pages/course", {course: res.course, reviews: res.reviews}) }
	});
}

function loadCourses(req,res,next){
	let year = Number(req.query.year) ? req.query.year : "";

	Subject.findOne({code: new RegExp(req.params.sid,"i")}, function(err,result){
		if(err){
			console.log(err);
			res.status(500).send("Something happend on our side.");
			return;
		}

		let subject = result.name;

		mongoose.connection.db.collection(subject).find({code: new RegExp(".* "+year+"[0-9]{3}","i")}).toArray(function(err2,courses){
			if(err2){
				console.log(err2);
				res.status(500).send("Something happend on our side.");
				return;
			}
	
			res.courses = courses;
			next();
		});
	});	
}

function sendCourses(req,res,next){
	res.format({
		"text/html": () => { res.render("pages/courses", {courses: res.courses}) },
		"application/json": () => { res.status(200).json({courses: res.courses}) }
	});
}


module.exports =	router;