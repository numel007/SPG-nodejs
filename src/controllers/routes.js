require("dotenv").config();
const express = require("express");
const axios = require("axios");

const router = express.Router();
var cors = require("cors");
var client_id = "CLIENT_ID";
var client_secret = "CLIENT_SECRET";
var redirect_uri = "REDIRECT_URI";
var stateKey = "spotify_auth_state";

function ranString(length) {
  str = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return str;
}

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
  let state = ranString(16);
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

module.exports = router;
