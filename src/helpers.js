require("dotenv").config();
const request = require("request");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const getRecommendations = (seedString, accessToken) => {
	return new Promise((resolve, reject) => {
		recommendationsOptions = {
			url: `https://api.spotify.com/v1/recommendations?limit=50&seed_artists=${seedString}`,
			headers: {
				Authorization: "Bearer " + accessToken,
				"Content-Type": "application/json",
			},
			json: true,
		};

		request.get(recommendationsOptions, (err, res, body) => {
			if (res.statusCode != 200) {
				reject(err);
			}
			let recommendList = body.tracks;
			let recommendUris = [];
			let recommendTitles = [];

			for (let i = 0; i < recommendList.length; i++) {
				recommendUris.push(recommendList[i].uri);
				recommendTitles.push(recommendList[i].name);
			}
			resolve([recommendUris, recommendTitles]);
		});
	});
};

const getPlaylistURIs = (playlistId, accessToken) => {
	return new Promise((resolve, reject) => {
		// Get song uris
		songURIs = [];
		playlistOptions = {
			url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
			headers: { Authorization: "Bearer " + accessToken },
			json: true,
		};

		request.get(playlistOptions, (err, res, body) => {
			let songsList = body.items;

			if (body.items.length != 0) {
				for (let i = 0; i < songsList.length; i++) {
					songURIs.push(songsList[i].track.uri);
				}
				resolve(songURIs);
			} else {
				resolve(songURIs);
			}
		});
	});
};

const addSongToPlaylist = (playlistId, accessToken, uriArray) => {
	return new Promise((resolve, reject) => {
		addSongsOptions = {
			url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
			headers: {
				Authorization: "Bearer " + accessToken,
				"Content-Type": "application/json",
			},
			body: { uris: uriArray },
			json: true,
		};

		request.post(addSongsOptions, (err, res, body) => {
			if (res.statusCode === 201) {
				resolve(body);
			}
			reject(err);
		});
	});
};

const clearPlaylist = (playlistId, accessToken) => {
	return new Promise((resolve, reject) => {
		songArray = [];
		getPlaylistURIs(playlistId, accessToken)
			.then((songURIs) => {
				if (songURIs.length != 0) {
					for (let i = 0; i < songURIs.length; i++) {
						songArray.push({ uri: songURIs[i] });
					}
					return songArray;
				} else {
					return songArray;
				}
			})
			.then((songArray) => {
				let deleteOptions = {
					url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
					headers: {
						Authorization: "Bearer " + accessToken,
						"Content-Type": "application/json",
					},
					body: { tracks: songArray },
					json: true,
				};

				request.delete(deleteOptions, (err, res, body) => {
					resolve(body);
				});
			});
	});
};

module.exports = {
	getRecommendations: getRecommendations,
	getPlaylistURIs: getPlaylistURIs,
	clearPlaylist: clearPlaylist,
	addSongToPlaylist: addSongToPlaylist,
};
