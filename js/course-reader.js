let fs = require("fs");
let courses;
let subjects;

courses = JSON.parse(fs.readFileSync("../courses.json"));
subjects = JSON.parse(fs.readFileSync("../subjects.json"));

let data = {};

Object.keys(subjects).forEach(subject => {
	data[subject] = [];
	for(course in courses){
		if(course.includes(subjects[subject])){
			let c = {};
			c.name = courses[course];
			c.code = course;
			data[subject].push(c);
		}
	}
});

// console.log(Object.keys(data));

module.exports = data;