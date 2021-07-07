require("dotenv").config();
const request = require("request");
const express = require("express");
const router = express.Router();

const middleware = require("../middleware");
const Playlist = require("../models/playlist");

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
		let newPlaylist = new Playlist();

		newPlaylist.playlistId = body.id;
		newPlaylist.userId = req.user_id;
		newPlaylist.refreshToken = req.accessToken;
		newPlaylist.name = body.name;
		newPlaylist.description = body.description;
		newPlaylist.collaborative = body.collaborative;

		console.log(`NEW PLAYLIST: ${newPlaylist}`);

		newPlaylist.save().then((playlist) => {
			res.send(Playlist.findById(playlist.playlistId));
		});
	});
});

module.exports = router;
