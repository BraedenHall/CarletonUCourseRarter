const mongoose = require("mongoose");
const express = require("express");
const Course = require("./courseModel");
const Review = require("./reviewModel");
const Subject = require("./subjectModel");

let router = express.Router();

// router.get("/", queryParser, searchAll, sendCourses);

router.get("/:sid", queryParser, loadCourses, sendCourses);

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
	let limit = 20;
	let start = (req.query.page - 1) * limit;
	let stop = (req.query.page) * limit;

	Subject.findOne({code: new RegExp(req.params.sid,"i")}, function(err,result){
		if(err){
			console.log(err);
			res.status(500).send("Something happend on our side.");
			return;
		}

		let subject = result.name;

		mongoose.connection.db.collection(subject).find({code: new RegExp(".* "+year+"[0-9]{3}","i")}).sort({ratingLength: -1}).toArray(function(err2,courses){
			if(err2){
				console.log(err2);
				res.status(500).send("Something happend on our side.");
				return;
			}
	
			res.courses = courses[stop] ? courses.slice(start,stop) : courses.slice(start);
			res.numPages = Math.ceil(courses.length/limit);
			next();
		});
	});	
}

function queryParser(req,res,next){
	let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
	req.qstring = params.join("&");
	
	try{
		req.query.page = req.query.page || 1;
		req.query.page = Number(req.query.page);
		if(req.query.page < 1){
			req.query.page = 1;
		}
	}catch{
		req.query.page = 1;
	}

	next();
}

// function searchAll(req,res,next){
// 	let courseStr = req.query.search;
// 	let limit = 20;
// 	let start = (req.query.page - 1) * limit;
// 	let stop = (req.query.page) * limit;

// 	console.log(courseStr);
// 	Subject.find(function(err,subjects){
// 		if(err){
// 			console.log(err);
// 			return;
// 		}

// 		let courses = [];
// 		count = 0;
// 		// console.log("s:"+subjects);
// 		subjects.forEach(subject => {
// 			mongoose.connection.db.collection(subject.name).createIndex({ code: "text", name: "text"},function(er,resu){
// 				mongoose.connection.db.collection(subject.name).find({$text: { $search: courseStr}}).sort({ score: { $meta: "textScore"} }).sort({ratingLength: -1}).sort({code: 1}).toArray(function(err2,result){
// 					if(err2){
// 						console.log(err2);
// 						return;
// 					}
	
// 					// if(res.courses.length < 20){
// 						courses = courses.concat(result);
// 						count++;
// 					// } else{
// 					// 	// res.courses = courses;
// 					// 	next();
// 					// }
	
// 					if(count == subjects.length){
// 						res.courses = courses[stop] ? courses.slice(start,stop) : courses.slice(start);
// 						res.numPages = Math.ceil(courses.length/limit);
// 						next();
// 					}
// 				});
// 			});
			
// 		});
// 	});
// }

function sendCourses(req,res,next){
	res.format({
		"text/html": () => { res.render("pages/courses", {courses: res.courses, page: req.query.page, qstring: req.qstring, numPages: res.numPages}) },
		"application/json": () => { res.status(200).json({courses: res.courses}) }
	});
}


module.exports =	router;