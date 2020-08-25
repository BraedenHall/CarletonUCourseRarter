function listCourses(){
	let subject = document.getElementById("subject2").value;
	let year = document.getElementById("year").value;
	let url = "https://localhost:3000/courses/";

	
	window.location.href = url+subject.slice(subject.indexOf("(")+1,-1).toLowerCase()+"?year="+year;
}

function getCourses(){
	let subject = document.getElementById("subject1").value;
	let select = document.getElementById("courses");
	$("#courses").empty();


	let url = "https://localhost:3000/courses/";

	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200){
			let courses = JSON.parse(this.responseText).courses;

			courses.forEach(course => {
				let option = document.createElement("option");
				option.text = course.name + " (" + course.code + ")";
				select.appendChild(option);
			});
			select.disabled = false;
			$('.selectpicker').selectpicker('refresh');
		}
	}
	xhttp.open("GET",url+subject.slice(-5,-1).toLowerCase()+"?subject="+subject.slice(0,-7),true);
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
}

function viewCourse(){
	let course = document.getElementById("courses").value;
	let url = "https://localhost:3000/courses/";

	if(!course.includes("--")){
		window.location.href = url+course.slice(course.indexOf("(")+1,-6).toLowerCase()+"/"+course.slice(-5,-1);
	}
}

function rateCourse(){
	let course = document.getElementById("courses").value;
	let url = "https://localhost:3000/reviews/";

	if(!course.includes("--")){
		window.location.href = url+course.slice(course.indexOf("(")+1,-6).toLowerCase()+course.slice(-5,-1);
	}
}

function submitReview(couseCode){
	let review = {};

	review.prof = document.getElementById("prof").value;
	review.rating = Number(document.getElementById("rating").value);
	review.difficulty = Number(document.getElementById("difficulty").value);
	review.review = document.getElementById("review").value;
	if(!document.getElementById("grade").value.includes("--")){
		review.grade = document.getElementById("grade").value;
	}

	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200){
			window.location.href = "https://localhost:3000/courses/"+couseCode.slice(0,-5).toLowerCase()+"/"+couseCode.slice(-4);
		}
	}
	xhttp.open("POST",document.URL,true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(review));
}