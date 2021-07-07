const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(mongoUri, { useNewUrlParser: true });

mongoose
	.connect(mongoUri)
	.then(() => console.log("Connected to DB"))
	.catch((err) => {
		throw err;
	});
module.exports = mongoose.connection;
