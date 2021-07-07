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

	request.post(playlistOptions, (err, response, body) => {
		let newPlaylist = new Playlist({
			playlistId: body.id,
			userId: req.user_id,
			refreshToken: req.accessToken,
			name: body.name,
			description: body.description,
			collaborative: body.collaborative,
		});

		newPlaylist
			.save()
			.then(() => {
				return Playlist.find({ playlistId: body.id }).lean();
			})
			.then((playlist) => {
				console.log(playlist);
				res.render("playlist_details", { playlist });
			});
	});
});

module.exports = router;
