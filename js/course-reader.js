let fs = require("fs");
let courses;
let subjects;

courses = JSON.parse(fs.readFileSync("../courses.json"));
subjects = JSON.parse(fs.readFileSync("../subjects.json"));

let data = {};

Object.keys(subjects).forEach(subject => {
	let sub = subject+" ("+subjects[subject]+")"
	data[sub] = [];
	for(course in courses){
		if(course.includes(subjects[subject])){
			let c = {};
			c.name = courses[course];
			c.code = course;
			c.ratings = [];
			c.avg = 0;
			data[sub].push(c);
		}
	}
});

// console.log(Object.keys(data));

module.exports = data;