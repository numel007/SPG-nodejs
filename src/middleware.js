require("dotenv").config();
const request = require("request");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const ranString = (length) => {
	str = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		str += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return str;
};

// Token verification
const verifyToken = (req, res, next) => {
	const accessToken = req.cookies.accessToken;
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		req.noRefreshToken = "Refresh token not found. Redirecting to login page"
		next();
		return
	}

	let authOptions = {
		url: "https://api.spotify.com/v1/me",
		headers: { Authorization: "Bearer " + accessToken },
		json: true,
	};

	request.get(authOptions, (err, res, body) => {
		if (body.error) {
			getAccessToken(refreshToken)
				.then((token) => {
					let authOptions = {
						url: "https://api.spotify.com/v1/me",
						headers: { Authorization: "Bearer " + token },
						json: true,
					};
					request.get(authOptions, (err, res, body) => {
						req.accessToken = token;
						req.user_id = body.id;
						next();
					});
				})
				.catch((err) => {
					console.log(err)
					req.noRefreshToken = err
					next()
					return
				});
		} else {
			req.accessToken = accessToken;
			req.user_id = body.id;
			next();
		}
	});
};

// Request access token using refresh token
const getAccessToken = (refreshToken) => {
	return new Promise((resolve, reject) => {
		const authOptions = {
			url: "https://accounts.spotify.com/api/token",
			headers: {
				Authorization:
					"Basic " +
					new Buffer.from(client_id + ":" + client_secret, "utf8").toString("base64"),
			},
			form: { grant_type: "refresh_token", refresh_token: refreshToken },
			json: true,
		};

		request.post(authOptions, (err, res, body) => {
			if (!err && res.statusCode === 200) {
				refreshedAccessToken = body.access_token;
				resolve(refreshedAccessToken);
			} else {
				reject(body);
			}
		});
	});
};

// Gets artist ID based on name
const getArtistId = (accessToken, artist) => {
	return new Promise( (resolve, reject) => {
		const authOptions = {
			url: "https://api.spotify.com/v1/search",
			headers: {
				Authorization: "Bearer " + accessToken
			},
			qs: {
				type: "artist",
				limit: 1,
				q: artist
			},
			json: true
		};
	
		request.get(authOptions, (err, res, body) => {
			if (res.statusCode === 200) {
				resolve(body.artists.items[0].id);
			} else {
				reject(err);
			}
		})
	})
}

module.exports = {
	ranString: ranString,
	verifyToken: verifyToken,
	getArtistId: getArtistId
};
