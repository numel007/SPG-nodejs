require("dotenv").config();
const express = require("express");
const request = require("request");

const router = express.Router();
// var cors = require("cors");
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = "http://localhost:3000/callback";
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

router.get("/callback", (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect("/#&error=state_mismatch");
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "/#" +
            `&access_token=${access_token}` +
            `&refresh_token=${refresh_token}`
        );
      } else {
        res.redirect("/#&error=invalid_token");
      }
    });
  }
});

router.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

module.exports = router;
