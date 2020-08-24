const mongoose = require("mongoose");
const express = require("express");
// let Course = require("./courseModel");

let router = express.Router();

router.get("/:sid", loadCourses, sendCourses);

router.get("/:sid/:cid", )


function loadCourses(req,res,next){
	let subject = req.query.subject;
	let year = Number(req.query.year) ? req.query.year : "";

	mongoose.connection.db.collection(subject).find({code: new RegExp(".* "+year+"[0-9]{3}","i")}).toArray(function(err,result){
		if(err){
			console.log(err);
			res.status(500).send("Something happend on our side.");
			return;
		}

		res.courses = result;
		next();
	});
}

function sendCourses(req,res,next){
	res.format({
		"text/html": () => { res.render("pages/courses", {courses: res.courses})}
	});
}


module.exports =	router;