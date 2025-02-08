require('dotenv').config();

const url = 'https://api.discogs.com';
const consumerKey = process.env.DISCOGS_CONSUMER_KEY;
const consumerSecret = process.env.DISCOGS_CONSUMER_SECRET;
const options = {
    headers: {
        'User-Agent': 'Record Show Mania/1.0 (Contact: recordshowmania@gmail.com)'
    }
}
const type = 'release';
const format ='vinyl';

/**
 * Searches Discogs database for album info
 * @param {String} query - The album to search for
 * @returns {Object} A JSON object containing album info
 */
async function searchDiscogs(query) {
    console.log(`Searching Discogs database for ${query}...`);

    let discogsResponseHeaders = {}

    const album = await fetch(`${url}/database/search?q=${query}&type=${type}&format=${format}&key=${consumerKey}&secret=${consumerSecret}`, options)
        .then(async response => {
            const responseHeaders = response.headers;
            discogsResponseHeaders['x-discogs-ratelimit'] = await responseHeaders.get('x-discogs-ratelimit');
            discogsResponseHeaders['x-discogs-ratelimit-remaining'] = await responseHeaders.get('x-discogs-ratelimit-remaining');
            discogsResponseHeaders['x-discogs-ratelimit-used'] = await responseHeaders.get('x-discogs-ratelimit-used');
            console.log(discogsResponseHeaders);
            return response.json();
        })
        .then(body => {
            if (body.results.length > 0) {
                console.log('Album data found.');
                const albumData = body.results[0];
                return albumData;
            } else {
                console.log('No album data found.');
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

module.exports = { searchDiscogs };