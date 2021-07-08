const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
	playlistId: { type: String, required: true },
	userId: { type: String, required: true },
	refreshToken: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, required: false },
	collaborative: { type: Boolean, required: true },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
