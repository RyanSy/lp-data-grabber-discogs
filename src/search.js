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
 * Searches Discogs database for album info
 * @param {String} query - The album to search for
 * @returns {Object} A JSON object containing album info
 * 
 * sample output:
 * 
 * {
  country: 'US',
  year: '1994',
  format: [ 'Vinyl', 'LP', 'Album' ],
  label: [ 'Columbia', 'Sony Music Entertainment Inc.' ],
  type: 'master',
  genre: [ 'Hip Hop' ],
  style: [ 'Conscious', 'Boom Bap' ],
  id: 20148,
  barcode: [
    '0 7464-57684-1 0',
    'AL 57684',
    'BL 57684',
    'AL-57684-1A 2-1 MASTERDISK TD',
    'BL-57684-1A 1-1'
  ],
  master_id: 20148,
  master_url: 'https://api.discogs.com/masters/20148',
  uri: '/master/20148-Nas-Illmatic',
  catno: 'C 57684',
  title: 'Nas - Illmatic',
  thumb: 'https://i.discogs.com/1GrA9UIHGuydnr9LlBMIP0lKySfmeU9-apaiVvbImmc/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM5MjYw/NC0xNjk2MDg5NjAw/LTY2MTcuanBlZw.jpeg',
  cover_image: 'https://i.discogs.com/wrbuutLseZDQSdcRIKF9dK1k-K00qs08bHHqr-bZ0p8/rs:fit/g:sm/q:90/h:593/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM5MjYw/NC0xNjk2MDg5NjAw/LTY2MTcuanBlZw.jpeg',
  resource_url: 'https://api.discogs.com/masters/20148',
  community: { want: 81193, have: 107419 }
}
 */
async function searchDiscogs(query) {
    if (typeof query !== 'undefined') {
        console.log(`Searching Discogs database for ${query}...`);

        const album = await fetch(`${url}/database/search?q=${query}&type=release&format=vinyl&key=${consumerKey}&secret=${consumerSecret}`, options)
            .then(result => {
                return result.json();
            })
            .then(body => {
                const albumData = body.results[0];
                console.log(`Album data found for ${albumData.title}`);
                // console.log(albumData)
                return albumData;
            })
            .catch(err => console.error('Error searching Discogs database:', err));
        
        return album; 
    } else {
        console.log('Search query returns undefined...')
    }
      
}

module.exports = { searchDiscogs };