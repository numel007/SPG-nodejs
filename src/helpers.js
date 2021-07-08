require("dotenv").config();
const request = require("request");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const getRecommendations = (seedString, accessToken) => {
	return new Promise((resolve, reject) => {
		recommendationsOptions = {
			url: `https://api.spotify.com/v1/recommendations?limit=5&seed_artists=${seedString}`,
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
			let recommendIds = [];
			let recommendTitles = [];

			for (let i = 0; i < recommendList.length; i++) {
				recommendIds.push(recommendList[i].id);
				recommendTitles.push(recommendList[i].name);
			}
			console.log(`Songs List: ${recommendTitles}`);
			console.log(`Song IDs: ${recommendIds}`);
			resolve([recommendIds, recommendTitles]);
		});
	});
};

module.exports = {
	getRecommendations: getRecommendations,
};
