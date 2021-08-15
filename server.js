require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");

// Initialize App
const app = express();

// Set app to use handlebars engine
app.set("view engine", "handlebars");

// Set handlebars config
app.engine("handlebars", handlebars());

// Use Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use cookieParser
app.use(cookieParser());

// Set up express static folder
afadfs.use(express.static("public"));

// MongoDB Setup
require("./src/config/db-setup");

// Routes
app.use(require("./src/controllers/auth"));
app.use(require("./src/controllers/routes"));

// Start server
app.listen(port, () => {
	console.log(`SPG listening on ${port}`);
});

module.exports = app;
