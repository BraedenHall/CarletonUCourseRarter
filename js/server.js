const express = require("express");
const fs = require("fs");
const https = require("https");
const mongoose = require("mongoose");

// const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
// const store = new MongoDBStore({
// 	uri: "mongodb://localhost:27017/tokens",
// 	collection: "sessions"
// });
const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("./public"));

let courseRouter = require("./course-router");
app.use("/courses", courseRouter);

app.get("/", loadSubjects, sendIndex);

function sendIndex(req,res,next){
	res.render("pages/index", {subjects: res.subjects});
}

function loadSubjects(req,res,next){
	mongoose.connection.db.listCollections({},{nameOnly: true}).toArray(function(err,result){
		if(err){
			console.log(err);
			return;
		}

		res.subjects = result.sort(function(a,b){
			if(a.name.toLowerCase() >= b.name.toLowerCase()){ return 1; }
			else{ return -1; }
		});
		// console.log(res.subjects);
		next();
	});
}


mongoose.connect("mongodb://localhost/courserater", { useNewUrlParser: true});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.on("open", function(){

	https.createServer({
		key: fs.readFileSync("./server.key"),
		cert: fs.readFileSync("./server.cert")
	}, app).listen(3000, function(){
		console.log("Server listening at https://localhost:3000/");
	});
});