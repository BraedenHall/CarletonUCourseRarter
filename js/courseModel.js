const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let courseScema = Schema({
	code: {
		type: String,
		required: true,
	}
});

module.exports = mongoose.model("Course", courseScema);