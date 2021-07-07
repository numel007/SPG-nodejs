const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI;
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(mongoUri, { useNewUrlParser: true });

mongoose.connection.on("error", (err) => {
	throw new Error(`Failed to connect to ${mongoUri}`);
});

module.exports = mongoose.connection;
