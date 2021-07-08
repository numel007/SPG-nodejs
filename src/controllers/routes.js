require("dotenv").config();
const request = require("request");
const express = require("express");
const router = express.Router();

const middleware = require("../middleware");
const helpers = require("../helpers");
const Playlist = require("../models/playlist");

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/create_playlist", middleware.verifyToken, (req, res) => {
	if (req.noRefreshToken) {
		res.redirect("/login");
	} else {
		res.render("create_playlist", { accessToken: req.accessToken });
	}
});

router.post("/create_playlist", middleware.verifyToken, (req, res) => {
	if (req.noRefreshToken) {
		res.redirect("/login");
	} else {
		let playlistOptions = {
			url: `https://api.spotify.com/v1/users/${req.user_id}/playlists`,
			headers: {
				Authorization: "Bearer " + req.accessToken,
				"Content-Type": "application/json",
			},
			body: {
				name: req.body.playlistName,
				description: req.body.Description,
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

			newPlaylist.save().then(() => {
				// Parse seed artists
				middleware.getArtistId(req.accessToken, req.body.artistNames).then((artistIds) => {
					// Call recommendation endpoint w/ artistIds
					helpers.getRecommendations(artistIds, req.accessToken).then((recommends) => {
						console.log(recommends);
						// Now clear the playlist
						helpers
							.clearPlaylist(body.id, req.accessToken)
							.then((songURIS) => console.log(songURIS));
						// Then add recommendIds to playlist
					});
				});
			});
		});
	}
});

router.post("/search_autocomplete", middleware.verifyToken, (req, res) => {
	// Example loop to retrieve artist ID
	const artistList = req.body.name;
	for (let i = 0; i < artistList.length; i++) {
		middleware.getArtistId(req.accessToken, artistList[i]).then((id) => {
			console.log(id);
		});
	}
	res.render("home");
});

module.exports = router;
