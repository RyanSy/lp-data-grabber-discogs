require('dotenv').config();

const url = 'https://api.discogs.com';
const consumerKey = process.env.DISCOGS_CONSUMER_KEY;
const consumerSecret = process.env.DISCOGS_CONSUMER_SECRET;
const options = {
    headers: {
        'User-Agent': 'LP Data Grabber/1.0'
    }
}

/**
 * 
 * @param {String} query 
 */
async function search(query) {
    const album = await fetch(`${url}/database/search?q=${query}&type=album&key=${consumerKey}&secret=${consumerSecret}`, options)
    .then(res => res.json())
    .then(body => console.log(body.results[0]))
    .catch(err => console.error(err));
}

search('nas - illmatic');
