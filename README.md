# Spotify Playlist Generator

Spotify Playlist Generator (SPG) creates Spotify playlists from user input seed artists or genre.

[Check out Spotify Playlist Generator here.](http://spg.caprover.benchan.tech/)

## Table of Contents

-   [Spotify Playlist Generator](#spotify-playlist-generator)
    -   [Building](#building)
        -   [Set up base files](#set-up-base-files)
        -   [Create Spotify dev account](#create-spotify-developer-account)
        -   [Set environment variables](#set-environment-variables)
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

1. Create Spotify developer account & app

    - Visit [this](https://developer.spotify.com/dashboard) link and create an app.
    - Enter your Application Name and Application Description and click Create.
    - Click on your newly created app within the dashboard to find your **Client ID** and **Client Secret**.
    - Set redirect uris to your domain's callback (ex. http://localhost:3000/callback)

1. Set environment variables

    - Open and edit `.env`
        - `PORT =` Whichever port you want the app to run on
        - `CLIENT_ID =` your Spotify dashboard client ID
        - `CLIENT_SECRET =` your Spotify dashboard client secret
        - `REDIRECT_URI =` your Spotify dashboard redirect uri
        - `MONGO_URI =` your MongoDB URI (can be local or cloud-based)

1. Run the application!
    - `npm start`

# Releases

-   **Current release**: [V1.0](http://spg.benchan.tech/)
-   **Next planned release**: V1.3 - 7/30/21
    -   Styling updates
    -   Prototype implementation of automatic playlist generation
    -   Fix playlist description not updating

## WIP Features

-   Nightly playlist generation (in-progress)
-   Genre input field
-   Danceability & liveliness sliders

### License

`SPG` is available under the MIT license. See the [LICENSE](https://github.com/numel007/SPG-nodejs/blob/deployment/LICENSE) for more info.
