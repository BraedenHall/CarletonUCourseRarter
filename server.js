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

app.use(express.static("./public"));



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