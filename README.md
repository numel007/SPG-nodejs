# Spotify Playlist Generator

Spotify Playlist Generator (SPG) creates Spotify playlists from user input seed artists or genre.

[Check out Spotify Playlist Generator here.](http://spg.caprover.benchan.tech/)

## Table of Contents

-   [Spotify Playlist Generator](#spotify-playlist-generator)
    -   [Building](#building)
        -   [Set up base files](#set-up-base-files)
        -   [Set up port](#set-up-port)
        -   [Create Spotify dev account](#create-spotify-developer-account)
        -   [Connect to MongoDB](#connect-to-mongodb)
        -   [Run the application](#run-the-application)
    -   [Releases](#releases)
    -   [WIP Features](#wip-features)

## Building

1. Set up base files

    ```
    git clone https://github.com/numel007/SPG-nodejs.git
    cd SPG-nodejs
    npm install
    cp .env.sample .env
    ```

1. Set port

    - Open your `.env` file and set the desired port to the right of `PORT=`.

1. Create Spotify developer account

    - Visit [this](https://developer.spotify.com/dashboard) link and create an app.
    - Enter your Application Name and Application Description and click Create.
    - Click on your newly created app within the dashboard to find your **Client ID** and **Client Secret**.
    - Set redirect uris to your domain's callback (ex. http://localhost:3000/callback)
    - Open your `.env` file and set `CLIENT_ID=` and `CLIENT_SECRET=` to the Client ID and Client Secret found on your dashboard.

1. Connect MongoDB & your domain

    - Open your `.env` file and set your MongoDB URI to the right of `MONGO_URI=`.
    - In `spg/src/controllers/auth.js` set `redirect_uri` to your domain's callback. (This is what you entered in the Spotify dashboard for redirect uri.)

1. Run the application!
    - `npm start`

# Releases

-   **Current release**: [V1.0](http://spg.caprover.benchan.tech/)
-   **Next planned release**: V1.3 - 7/30/21
    -   Styling updates
    -   Prototype implementation of automatic playlist generation
    -   Fix playlist description not updating

## WIP Features

-   Nightly playlist generation (in-progress)
-   Genre input field
-   Danceability & liveliness sliders

### License

`SPG` is available under the MIT license. See the [LICENSE]() for more info.
