require("dotenv").config();
const request = require("request");
const express = require("express");
const router = express.Router();

const middleware = require("../middleware");

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/create_playlist", middleware.verifyToken, (req, res) => {
	res.render("create_playlist");
});

router.post("/create_playlist", middleware.verifyToken, (req, res) => {
	let playlistOptions = {
		url: `https://api.spotify.com/v1/users/${req.user_id}/playlists`,
		headers: {
			Authorization: "Bearer " + req.accessToken,
			"Content-Type": "application/json",
		},
		body: {
			name: req.body.name,
			description: req.body.description,
			public: false,
		},
		json: true,
	};

	request.post(playlistOptions, (err, res, body) => {
		console.log(body);
	});
});

router.get("/search_autocomplete", middleware.verifyToken, (req, res) => {
    if (req.noRefreshToken) {
        res.redirect('/login')
    } else {
        res.render("search_autocomplete", { accessToken: req.accessToken })
    }
})

router.post("/search_autocomplete", middleware.verifyToken, (req, res) => {
    // Example loop to retrieve artist ID
    const artistList = req.body.name
    for (let i = 0; i < artistList.length; i++) {
        middleware.getArtistId(req.accessToken, artistList[i])
        .then(id => {
            console.log(id)
        })
    }
    res.render("home")
})

module.exports = router;
