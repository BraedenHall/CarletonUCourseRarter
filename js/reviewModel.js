const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	difficulty: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	review: {
		required: true,
		type: String,
		minlength: 1,
		maxlength: 400
	},
	prof: {
		type: String,
		required: true
	},
	grade: {
		type: String
	},
	tags: [String],
	course: {
		type: {
			id: Schema.Types.ObjectId,
			code: {
				type: String,
				match: /[A-Z]{3,4} [0-9]{4}/,
				required: true,
				// validate: {
				// 	validator: function(c){
				// 		return /[A-Z]{3,4} [0-9]{4}/.text(c);
				// 	},
				// 	message: "Course code has invalid format."
				// }
			}
		},
		required: true
	}
});

module.exports = mongoose.model("Review", reviewSchema);