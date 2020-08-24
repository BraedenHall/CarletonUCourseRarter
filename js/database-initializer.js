let mongo = require("mongodb");
let  MongoClient = mongo.MongoClient;
let db;

let courses = require("./course-reader");

let closeCount = Object.keys(data).length;

setInterval(() => {
	if(closeCount == 0){
		client.close();
	}
}, 10000);

MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;	

  db = client.db('courserater');
  
  db.listCollections().toArray(function(err, result){
	 	if(result.length == 0){
			Object.keys(courses).forEach(subject => {
				setTimeout(function(){
					db.collection(subject).insertMany(courses[subject], function(err, result){
						if(err){
							throw err;
						}
						
						console.log(subject);
						closeCount-=1;
					});
				},2000);
			});
			return;
		}
	
		let numDropped = 0;
	 	let toDrop = result.length;
		result.forEach(collection => {
			setTimeout(function(){
				db.collection(collection.name).drop(function(err, delOK){
					if(err){
						throw err;
					}
					
					console.log("Dropped collection: " + collection.name);
					numDropped++;
					
					if(numDropped == toDrop){
						Object.keys(courses).forEach(subject => {
							setTimeout(function(){
								db.collection(subject).insertMany(courses[subject], function(err, result){
									if(err){
										throw err;
									}
									
									console.log(subject);
									closeCount-=1;
								});
							},2000);
						});
					}
				});	
			}, 2000);	
		});
	});
});