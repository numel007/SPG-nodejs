require("dotenv").config();
const request = require("request");
const express = require("express");
const router = express.Router();

const middleware = require("../middleware");
const helpers = require("../helpers");

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

router.post("/create_playlist", middleware.verifyToken, async (req, res) => {
	if (req.noRefreshToken) {
		res.redirect("/login");
	} else {
		try {
			const playlistId = await helpers.createPlaylist(req.accessToken, req.cookies.refreshToken, req.user_id, req.body.playlistName, req.body.Description)

			// Parse seed artists
			const artistIds = await helpers.getArtistId(req.accessToken, req.body.artistNames);

			// Call recommendation endpoint w/ artistIds
			const recommendUris = await helpers.getRecommendations(artistIds, req.accessToken);

			// Now clear the playlist
			await helpers.clearPlaylist(playlistId, req.accessToken);

			// Then add recommendIds to playlist
			await helpers.addSongToPlaylist(playlistId, req.accessToken, recommendUris[0]);

			// Then get newly created playlist's details to be displayed on webpage
			const playlistDetails = await helpers.getCurrentPlaylistDetails(req.accessToken, req.cookies.refreshToken);
			return res.send(playlistDetails)
		} catch (error) {
			console.log(error)
			return res.send({ error: error})
		}
	}
});

module.exports = router;
