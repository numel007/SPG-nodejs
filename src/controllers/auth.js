require("dotenv").config();
const express = require("express");
const request = require("request");
const auth = express.Router();

const middleware = require("../middleware");
// let cors = require("cors");
let client_id = process.env.CLIENT_ID;
let client_secret = process.env.CLIENT_SECRET;
let redirect_uri = "http://spg.caprover.benchan.tech/callback";
let stateKey = "spotify_auth_state";

auth.get("/login", (req, res) => {
	let state = middleware.ranString(16);
	let scope = "playlist-modify-private playlist-read-private";

	res.cookie(stateKey, state);
	res.redirect(
		"https://accounts.spotify.com/authorize?response_type=code" +
			`&client_id=${client_id}` +
			`&scope=${scope}` +
			`&redirect_uri=${redirect_uri}` +
			`&state=${state}`
	);
});

auth.get("/callback", (req, res) => {
	let code = req.query.code || null;
	let state = req.query.state || null;
	let storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect("/error");
	} else {
		res.clearCookie(stateKey);
		let authOptions = {
			url: "https://accounts.spotify.com/api/token",
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: "authorization_code",
			},
			headers: {
				Authorization:
					"Basic " +
					new Buffer.from(client_id + ":" + client_secret, "utf8").toString("base64"),
			},
			json: true,
		};

		request.post(authOptions, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				let access_token = body.access_token,
					refresh_token = body.refresh_token;

				res.cookie("accessToken", access_token, { httpOnly: true });
				res.cookie("refreshToken", refresh_token, { httpOnly: true });

				let options = {
					url: "https://api.spotify.com/v1/me",
					headers: { Authorization: "Bearer " + access_token },
					json: true,
				};

				// use the access token to access the Spotify Web API
				request.get(options, (error, response, body) => {
					console.log(body);
				});

				res.redirect("/create_playlist");
			} else {
				res.render("error");
			}
		});
	}
});

auth.get("/refresh_token", (req, res) => {
	// requesting access token from refresh token
	let refresh_token = req.query.refresh_token;
	let authOptions = {
		url: "https://accounts.spotify.com/api/token",
		headers: {
			Authorization:
				"Basic " +
				new Buffer.from(client_id + ":" + client_secret, "utf8").toString("base64"),
		},
		form: {
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		},
		json: true,
	};

	request.post(authOptions, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			let access_token = body.access_token;
			res.send({
				access_token: access_token,
			});
		}
	});
});

module.exports = auth;
