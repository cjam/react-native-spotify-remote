# Example Token Refresh Server

An example server capable of swapping and refreshing tokens provided by Spotify API.

## Usage

1. Install dependencies using: 
```sh
yarn   # or npm install
```
2. Create a `.env` file in the root of this directory with the following entries acquired from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) :
> ⚠️ Don't commit the `.env` file to your repo ⚠️

```env
SPOTIFY_CLIENT_ID="client_id_from_spotify_dashboard"
SPOTIFY_CLIENT_SECRET="client_secret_from_spotify_dashboard"
SPOTIFY_CLIENT_CALLBACK="callback_registered_in_spotify_dashboard"
ENCRYPTION_SECRET="THISWILLBEABIGSECRET"
ENCRYPTION_METHOD="aes-256-ctr"
```
Can also specify `PORT` if you want to run it on something other than 3000.
> Optionally this can be done on the command line as well when starting up the server via node

3. Run server using: `yarn start`
4. In your react-native app set `tokenSwapURL` to `http://<SERVER_URL>:<PORT>/swap` and `tokenRefreshURL` to `http://<SERVER_URL>:<PORT>/refresh`, replacing `<SERVER_URL>` and `<PORT>` with your server URL and port.
