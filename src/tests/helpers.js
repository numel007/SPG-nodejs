require('dotenv').config();
const request = require('request');
const helpers = require('../helpers.js')
const app = require('../../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.config.includeStack = true

const expect = chai.expect;
chai.use(chaiHttp);

let authToken

async function getAuthToken() {
    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            Authorization:
                "Basic " +
                new Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET, "utf8").toString("base64"),
        },
        form: { grant_type: "refresh_token", refresh_token: process.env.UNIT_TEST_REFRESH_TOKEN },
        json: true,
    };

    return new Promise( (resolve, reject) => {
        request.post(authOptions, (err, res, body) => {
            if (res.statusCode === 200) {
                authToken = body.access_token;
                resolve(authToken)
            }
            else {
                reject('Failed to retrieve access token')
            }
        })
    })
}

async function getUserId() {
    return new Promise( (resolve, reject) => {
        getAuthToken()
        .then( token => {
            let authOptions = {
                url: "https://api.spotify.com/v1/me",
                headers: { Authorization: "Bearer " + token },
                json: true,
            };

            request.get(authOptions, (err, res, body) => {
                if (res.statusCode === 200) {
                    resolve(body.id);
                }
                else {
                    reject(`Failed to retrieve user id.`)
                }
            });
        })
    })
}

async function getPlaylistDetails(accessToken, playlistId) {
    return new Promise( (resolve, reject) => {
        let playlistOptions = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
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
}

describe('Test helper functions', () => {
    it("should create a new playlist on the user's account", async () => {
        const userId = await getUserId();
        const newPlaylist = await helpers.createPlaylist(authToken, 'Example refresh token', userId, 'Mocha/Chai testing playlist', 'New test playlist description');
        expect(newPlaylist).to.be.a('string');
    });

    it("should return a string containing the Ids of all artists", async () => {
        artistArray = ['Alan Walker', 'Dreamcatcher', 'Two Steps From Hell']
        const token = await getAuthToken();
        const artistIds = await helpers.getArtistId(token, artistArray);
        expect(artistIds).to.be.a('string');
    });

    it("should generate an array of songs and song ids based on the three seed artists", async () => {
        const token = await getAuthToken();

        // Pass in a test string consisting of the Ids of 3 different artists (Alan Walker, Dreamcatcher, Two Steps From Hell)
        const recommendations = await helpers.getRecommendations('7vk5e3vY1uw9plTHJAMwjN,5V1qsQHdXNm4ZEZHWvFnqQ,2qvP9yerCZCS0U1gZU8wYp', token);
        expect(recommendations).to.be.a('array');
    });

    it("should clear the specified playlist", async () => {
        const userId = await getUserId();
        const playlistId = await helpers.createPlaylist(authToken, 'Example refresh token', userId, 'Mocha/Chai testing playlist', 'New test playlist description');
        const clearPlaylist = await helpers.clearPlaylist(playlistId, authToken);
        expect(clearPlaylist.snapshot_id).to.be.a('string');
    });

    it("should add recommended Ids to the playlist", async () => {
        const userId = await getUserId();

        // Generate new playlist and get its Id
        const playlistId = await helpers.createPlaylist(authToken, 'Example refresh token', userId, 'Mocha/Chai testing playlist', 'New test playlist description');

        // Pass in a test string consisting of the Ids of 3 different artists (Alan Walker, Dreamcatcher, Two Steps From Hell)
        const recommendations = await helpers.getRecommendations('7vk5e3vY1uw9plTHJAMwjN,5V1qsQHdXNm4ZEZHWvFnqQ,2qvP9yerCZCS0U1gZU8wYp', authToken);

        // Add all recommended Ids to the new playlist
        const populatedPlaylist = await helpers.addSongToPlaylist(playlistId, authToken, recommendations[0]);
        expect(populatedPlaylist.snapshot_id).to.be.a('string');
    });

    it("should return playlist details", async () => {
        const userId = await getUserId();

        // Generate new playlist and get its Id
        const playlistId = await helpers.createPlaylist(authToken, 'Example refresh token', userId, 'Mocha/Chai testing playlist', 'New test playlist description');

        // Pass in a test string consisting of the Ids of 3 different artists (Alan Walker, Dreamcatcher, Two Steps From Hell)
        const recommendations = await helpers.getRecommendations('7vk5e3vY1uw9plTHJAMwjN,5V1qsQHdXNm4ZEZHWvFnqQ,2qvP9yerCZCS0U1gZU8wYp', authToken);

        // Add all recommended Ids to the new playlist
        const populatedPlaylist = await helpers.addSongToPlaylist(playlistId, authToken, recommendations[0]);

        // Retrieve details of the newly created playlist
        const playlistDetails = await getPlaylistDetails(authToken, playlistId)
        expect(playlistDetails).to.be.a('array');
    })
})