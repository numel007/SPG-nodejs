require("dotenv").config();
const express = require("express");
const request = require("request");

const router = express.Router();
// let cors = require("cors");
let client_id = process.env.CLIENT_ID;
let client_secret = process.env.CLIENT_SECRET;
let redirect_uri = "http://localhost:3000/callback";
let stateKey = "spotify_auth_state";

function ranString(length) {
  str = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
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
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let access_token = body.access_token,
          refresh_token = body.refresh_token;

        res.cookie('accessToken', access_token, { httpOnly: true })
        res.cookie('refreshToken', refresh_token, { httpOnly: true })

        let options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        // res.redirect(
        //   "/#" +
        //     `?access_token=${access_token}` +
        //     `&refresh_token=${refresh_token}`
        // );
        console.log("rendering login");
        res.render("login");
      } else {
        res.render("error");
      }
    });
  }
});

router.get("/refresh_token", (req, res) => {
  // requesting access token from refresh token
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " + new Buffer.from(client_id + ":" + client_secret, "base64"),
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

module.exports = router;
