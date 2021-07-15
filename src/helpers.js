require("dotenv").config();
const request = require("request");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const Playlist = require("./models/playlist");

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
			if (res.statusCode === 200) {
				let recommendList = body.tracks;
				let recommendUris = [];
				let recommendTitles = [];
	
				for (let i = 0; i < recommendList.length; i++) {
					recommendUris.push(recommendList[i].uri);
					recommendTitles.push(recommendList[i].name);
				}
				resolve([recommendUris, recommendTitles]);
			} else {
				reject(`getRecommendations helper failed with response: ${res.statusCode}`);
			}
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
			if (res.statusCode === 200) {
				if (body.items.length != 0) {
					for (let i = 0; i < songsList.length; i++) {
						songURIs.push(songsList[i].track.uri);
					}
					resolve(songURIs);
				} else {
					resolve(songURIs);
				}
			} else {
				reject(`getPlaylistURIs helper failed with response: ${res.statusCode}`);
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
			} else {
				reject(`addSongToPlaylist helper failed with response: ${res.statusCode}`);
			}
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
			}).catch( error => {
				resolve(error);
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
					if (res.statusCode === 200) {
						resolve(body);
					} else {
						reject(`clearPlaylist helper failed with response: ${res.statusCode}`);
					}
				});
			});
	});
};

const getCurrentPlaylistDetails = (accessToken, refreshToken) => {
	return new Promise((resolve, reject) => {
		Playlist.findOne({ refreshToken: refreshToken}).sort({ _id: -1 })
		.then( result => {
			let playlistOptions = {
				url: `https://api.spotify.com/v1/playlists/${result.playlistId}/tracks`,
				headers: {
					Authorization: "Bearer " + accessToken,
					"Content-Type": "application/json",
				},
				json: true,
			}
	
			request.get(playlistOptions, (error, response, body) => {
				if (response.statusCode === 200) {
					resolve(body.items);
				} else {
					reject(`getCurrentPlaylistDetails helper failed with response: ${response.statusCode}`)
				}
			})
		})
	})
};

/**
 * Creates a playlist on the user's Spotify account and then stores relevant information into database for future use.
 * @param {String} accessToken User's access token
 * @param {String} refreshToken User's refresh token
 * @param {String} userId Current logged in user's spotify ID
 * @param {String} playlistName Name entered in playlist name field on webpage
 * @param {String} playlistDescription Description entered in playlist description field on webpage
 * @returns ID of the newly created playlist
 */
const createPlaylist = (accessToken, refreshToken, userId, playlistName, playlistDescription) => {
	return new Promise((resolve, reject) => {
		let playlistOptions = {
			url: `https://api.spotify.com/v1/users/${userId}/playlists`,
			headers: {
				Authorization: "Bearer " + accessToken,
				"Content-Type": "application/json",
			},
			body: {
				name: playlistName,
				description: playlistDescription,
				public: false,
			},
			json: true,
		};
	
		request.post(playlistOptions, (err, response, body) => {
			if (response.statusCode === 201) {
				let newPlaylist = new Playlist({
					playlistId: body.id,
					userId: userId,
					accessToken: accessToken,
					refreshToken: refreshToken,
					name: body.name,
					description: body.description,
					collaborative: body.collaborative,
				});
				
				newPlaylist.save();
				resolve(body.id);
			} else {
				reject(`createPlaylist helper failed with response: ${response.statusCode}`);
			}
		})
	})
};

/**
 * Takes in a list of artists from frontend uses Spotify search api to obtain the ID of each artist.
 * Converts list items into a string with each ID separated by commas, a syntax required by Spotify's recommendation API.
 * @param {String} accessToken User's access token
 * @param {String} artistList List of artists taken from seed artists fields
 * @returns Artist IDs in string format with commas between each ID
 */
const getArtistId = (accessToken, artistList) => {
	return new Promise((resolve, reject) => {
		let promises = [];

		for (let i = 0; i < artistList.length; i++) {
			promises.push(
				new Promise((resolve, reject) => {
					const authOptions = {
						url: "https://api.spotify.com/v1/search",
						headers: {
							Authorization: "Bearer " + accessToken,
						},
						qs: {
							type: "artist",
							limit: 1,
							q: artistList[i],
						},
						json: true,
					};

					request.get(authOptions, (err, res, body) => {
						if (res.statusCode === 200) {
							resolve(body.artists.items[0].id);
						} else {
							reject(`getArtistId's request.get failed with response: ${res.statusCode}`);
						}
					});
				})
			);
		}
		Promise.all(promises).then((artistIds) => {
			seedString = `${artistIds[0]}`;
			for (let i = 1; i < artistIds.length; i++) {
				seedString += "," + artistIds[i];
			}
			resolve(seedString);
		})
		.catch( error => {
			reject(error);
		})
	});
};

module.exports = {
	getRecommendations: getRecommendations,
	getPlaylistURIs: getPlaylistURIs,
	clearPlaylist: clearPlaylist,
	addSongToPlaylist: addSongToPlaylist,
	getCurrentPlaylistDetails: getCurrentPlaylistDetails,
	createPlaylist: createPlaylist,
	getArtistId: getArtistId,
};
