require('dotenv').config();

const discogsToken = process.env.DISCOGS_TOKEN;
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

/**
 * Searches Discogs database for album info
 * @param {String} query - The album to search for
 * @returns {Object} A JSON object containing album info
 */
async function getDiscogsData(query) {
    console.log(`Searching Discogs database for ${query}...`);

    let discogsResponseHeaders = {}

    const album = await fetch(`https://api.discogs.com/database/search?q=${query}&type=release&format=vinyl`, {
        headers: {
            'User-Agent': 'Vinyl Steve/1.0 (Contact: vinylsteve109@gmail.com)',
            'Authorization': `Discogs token=${discogsToken}`
        }
    })
        .then(async response => {
            // check discogs rate limit
            // const responseHeaders = response.headers;
            // discogsResponseHeaders['x-discogs-ratelimit'] = await responseHeaders.get('x-discogs-ratelimit');
            // discogsResponseHeaders['x-discogs-ratelimit-remaining'] = await responseHeaders.get('x-discogs-ratelimit-remaining');
            // discogsResponseHeaders['x-discogs-ratelimit-used'] = await responseHeaders.get('x-discogs-ratelimit-used');
            // console.log('Discogs response headers:', discogsResponseHeaders);
            return response.json();
        })
        .then(body => {
            if (body.results.length > 0) {
                console.log('Discogs album data found.');
                const albumData = body.results[0];
                return albumData;
            } else {
                console.log('No Discogs album data found.');
                return null;
            }
        })
        .catch(err => console.error('Error searching Discogs database:', err));
    
    if (typeof album !== 'undefined') {
        return album;
    } else {
        return null;
    }
}

/**
 * Retrieves an access token used to make calls to the Spotify Web API
 * @returns JSON object containing access token data
 */
async function getSpotifyAccessToken() {
    console.log('Getting Spotify access token...');

   const spotifyAccessToken = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
        },
    })
        .then(response => {
            console.log(`Fetch acces token status: ${response.status} - ${response.statusText}`);
            return response.json(); 
        })
        .then(data => {
            console.log('Access token successfully retrieved.');
            return data.access_token;
        })
        .catch(err => console.error('Error getting access token:', err));

    return spotifyAccessToken;
}

/**
 * Searches the Spotify catalog for a specific album cover image
 * @param {string} access_token - Access token obtained from the getToken function.
 * @param {string} query - Album to search for.
 * @returns JSON object containing album data.
 */
async function getSpotifyCoverArt(access_token, query) {
    console.log(`Searching for cover art...`);

    const spotifyCoverArt = await fetch(`https://api.spotify.com/v1/search?&q=${query}&type=album&limit=1`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    })
        .then(response => {
            console.log(`Fetch cover art status: ${response.status} - ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            if (data.albums) {
                console.log('Cover art successfully retrieved.');
                return data.albums.items[0].images[0].url;
            } else {
                console.log('Cover art not found.');
                return null;
            }    
        })
        .catch(err => console.error('Error searching for cover art:', err));

    return spotifyCoverArt;
}

module.exports = { getDiscogsData, getSpotifyAccessToken, getSpotifyCoverArt };