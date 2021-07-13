# Spotify Playlist Generator
Spotify Playlist Generator (SPG) gives users greater control over automatically generated playlists. Currently, Spotify generates a “discover weekly” playlist, which as the name suggests, is a playlist created once a week which houses music that Spotify believes the user will enjoy. The suggested songs are based on the user’s past listening and liked songs which are fed through some algorithm. SPG gives users the ability to specify their favorite artists and tracks, rather than having Spotify make guesses. This allows for a more refined and perhaps even predictable playlist, generated as often as needed. SPG is designed to help Spotify users have greater control over their listening experiences.

- [Spotify Playlist Generator](#spotify-playlist-generator)
    - [How to run](#how-to-run)
        - [Set up base files](#set-up-base-files)
        - [Set up port](#set-up-port)
        - [Create Spotify dev account](#create-spotify-developer-account)
        - [Connect to MongoDB](#connect-to-mongodb)
        - [Run the application](#run-the-application)


## How to run
### Set up base files
```
git clone https://github.com/numel007/SPG-nodejs.git
cd SPG-nodejs
npm install
cp .env.sample .env
```

### Set up port
1. Open your `.env` file and set the desired port to the right of `PORT=`.

### Create Spotify developer account
1. Visit [this](#https://developer.spotify.com/dashboard) link and Create An App.
1. Enter your Application Name and Application Description and click Create.
1. Click on your newly created app within the dashboard to find your **Client ID** and **Client Secret**.
1. Open your `.env` file and set `CLIENT_ID=` and `CLIENT_SECRET=` to the Client ID and Client Secret found on your dashboard.

### Connect to MongoDB
1. Open your `.env` file and set your MongoDB URI to the right of `MONGO_URI=`.

### Run the application!
```
npm start
```