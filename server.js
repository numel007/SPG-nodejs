require('dotenv').config()
const port = 3000;
const express = require('express');
const handlebars = require('express-handlebars');
const axios = require('axios')

// Initialize App
const app = express()

// Set app to use handlebars engine
app.set('view engine', 'handlebars');

// Set handlebars config
app.engine('handlebars', handlebars());

// Use Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up express static folder
app.use(express.static('public'))

// Start server
app.listen(port, () => {
    console.log(`Weather app listening on ${port}`)
});