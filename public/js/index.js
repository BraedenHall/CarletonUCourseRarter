function listCourses(){
	let subject = document.getElementById("subject2").value;
	let year = document.getElementById("year").value;
	let url = "https://localhost:3000/courses/";

	
	window.location.href = url+subject.slice(-5,-1).toLowerCase()+"?subject="+subject+"&year="+year;
}