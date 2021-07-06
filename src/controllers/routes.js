require("dotenv").config();
const express = require("express");
const router = express.Router();

const middleware = require('../middleware')

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/playlist", middleware.verifyToken, (req, res) => {
    res.render("playlist");
});

module.exports = router;