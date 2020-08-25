const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let subjectSchema = Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		required: true,
		type: String,
		match: /[A-Z]{3,4}/,	
		// validate: {
		// 	validator: function(c){
		// 		return /[A-Z]{3,4}/.text(c);
		// 	},
		// 	message: "Subject code has invalid format."
		// }
	}
});

module.exports = mongoose.model("Subject", subjectSchema);