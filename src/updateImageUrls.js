const albumTitles = require('./albumTitles');
const albumTitlesLength = albumTitles.length;
let index = 0;
const search = require('./search');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');

const inputCsvJson = [];
let modifiedCsvJson = [];

/**
 * Global config.
 */
const config = {
  inputFile: './files/products-old.csv',
  outputFile: './files/products-new.csv',
//   rejectsFile: './files/rejects.txt'
};

const csvWriter = createCsvWriter({
    path: config.outputFile,
    header: [
        {id: 'Handle', title: 'Handle'},
        {id: 'Title', title: 'Title'},
        {id: 'Body (HTML)', title: 'Body (HTML)'},
        {id: 'Vendor', title: 'Vendor'},
        {id: 'Product Category', title: 'Product Category'},
        {id: 'Type', title: 'Type'},
        {id: 'Tags', title: 'Tags'},
        {id: 'Published', title: 'Published'},
        {id: 'Option1 Name', title: 'Option1 Name'},
        {id: 'Option1 Value', title: 'Option1 Value'},
        {id: 'Option2 Name', title: 'Option2 Name'},
        {id: 'Option2 Value', title: 'Option2 Value'},
        {id: 'Option3 Name', title: 'Option3 Name'},
        {id: 'Option3 Value', title: 'Option3 Value'},
        {id: 'Variant SKU', title: 'Variant SKU'},
        {id: 'Variant Grams', title: 'Variant Grams'},
        {id: 'Variant Inventory Tracker', title: 'Variant Inventory Tracker'},
        {id: 'Variant Inventory Qty', title: 'Variant Inventory Qty'},
        {id: 'Variant Inventory Policy', title: 'Variant Inventory Policy'},
        {id: 'Variant Fulfillment Service', title: 'Variant Fulfillment Service'},
        {id: 'Variant Price', title: 'Variant Price'},
        {id: 'Variant Compare At Price', title: 'Variant Compare At Price'},
        {id: 'Variant Requires Shipping', title: 'Variant Requires Shipping'},
        {id: 'Variant Taxable', title: 'Variant Taxable'},
        {id: 'Variant Barcode', title: 'Variant Barcode'},
        {id: 'Image Src', title: 'Image Src'},
        {id: 'Image Position', title: 'Image Position'},
        {id: 'Image Alt Text', title: 'Image Alt Text'},
        {id: 'Gift Card', title: 'Gift Card'},
        {id: 'SEO Title', title: 'SEO Title'},
        {id: 'SEO Description', title: 'SEO Description'},
        {id: 'Google Shopping / Google Product Category', title: 'Google Shopping / Google Product Category'},
        {id: 'Google Shopping / Gender', title: 'Google Shopping / Gender'},
        {id: 'Google Shopping / Age Group', title: 'Google Shopping / Age Group'},
        {id: 'Google Shopping / MPN', title: 'Google Shopping / MPN'},
        {id: 'Google Shopping / AdWords Grouping', title: 'Google Shopping / AdWords Grouping'},
        {id: 'Google Shopping / AdWords Labels', title: 'Google Shopping / AdWords Labels'},
        {id: 'Google Shopping / Condition', title: 'Google Shopping / Condition'},
        {id: 'Google Shopping / Custom Product', title: 'Google Shopping / Custom Product'},
        {id: 'Google Shopping / Custom Label 0', title: 'Google Shopping / Custom Label 0'},
        {id: 'Google Shopping / Custom Label 1', title: 'Google Shopping / Custom Label 1'},
        {id: 'Google Shopping / Custom Label 2', title: 'Google Shopping / Custom Label 2'},
        {id: 'Google Shopping / Custom Label 3', title: 'Google Shopping / Custom Label 3'},
        {id: 'Google Shopping / Custom Label 4', title: 'Google Shopping / Custom Label 4'},
        {id: 'Variant Image', title: 'Variant Image'},
        {id: 'Variant Weight Unit', title: 'Variant Weight Unit'},
        {id: 'Variant Tax Code', title: 'Variant Tax Code'},
        {id: 'Cost per item', title: 'Cost per item'},
        {id: 'Price / International', title: 'Price / International'},
        {id: 'Compare At Price / International', title: 'Compare At Price / International'},
        {id: 'Status', title: 'Status'}
    ]
});

/**
 * Initialise script.
 */
function init() {
    console.log('Initiating...');
    console.log(`Preparing to parse CSV file... ${config.inputFile}`);
  
    fs.createReadStream(config.inputFile)
      .pipe(csv())
      .on('data', (data) => inputCsvJson.push(data))
      .on('end', () => {
        modifiedCsvJson = inputCsvJson
  
        console.log('...Done');
  
        initFunctions();
      });
}

/**
 * Execute functions once data is available.
 */
function initFunctions() {
    console.log('Initiating script functionality...');
    
    getNewimageUrl();

    /**
     * Once everything is finished, write to file.
     */
    writeDataToFile();
}

/**
 * Search Spotify API for new image url. 
 */
function getNewimageUrl() {
    console.log('Getting image url from Spotify API...');

    const spotifyAccessToken = search.getSpotifyAccessToken();
    const coverArtUrl = search.getSpotifyCoverArt(spotifyAccessToken, albumTitles[index]);

    modifiedCsvJson = modifiedCsvJson.map((item) => {
        const updatedItem = item;
        const itemKey = 'Image Src';

        updatedItem[itemKey] = coverArtUrl;

        return updatedItem;
    });
}

/**
 * Write all modified data to its own CSV file.
 */
function writeDataToFile() {
    console.log(`Writing data to a file...`);
  
    csvWriter.writeRecords(modifiedCsvJson)
      .then(() => {
        console.log('The CSV file was written successfully!')
  
        console.log('...Finished!');
      });
}

init();

/**
 * will use parts of code below to handle albums not found.
 */
// // write albums not found to a txt file
// const rejectsTxtWriter = createCsvWriter({
//     path: path.join(__dirname, `../../data-grabber-files/${rejectsTxtFile}`),
//     // header: ['title']
// });

// // main function
// async function main() {
//     // get access token, then search Spotify for cover art
//     const spotifyAccessToken = await search.getSpotifyAccessToken();
//     const coverArtUrl = await search.getSpotifyCoverArt(spotifyAccessToken, albumTitles[index]);

//     // if coverArtUrl is not null, update url in products csv file
//     if (coverArtUrl !== null) {
//         const cover_image = coverArtUrl;
//         const product = {
//             'Handle': title,
//             'Title': title,
//             'Body (HTML)': '',
//             'Vendor': 'Village Record Club',
//             'Product Category': 'Media > Music & Sound Recordings > Records & LPs',
//             'Type': 'album',
//             'Tags': `${format}, ${label}, ${genre}, ${style}`,
//             'Published': '',
//             'Option1 Name': '',
//             'Option1 Value': '',
//             'Option2 Name': '',
//             'Option2 Value': '',
//             'Option3 Name': '',
//             'Option3 Value': '',
//             'Variant SKU': '',
//             'Variant Grams': '',
//             'Variant Inventory Tracker': '',
//             'Variant Inventory Qty': '',
//             'Variant Inventory Policy': 'deny',
//             'Variant Fulfillment Service': 'manual',
//             'Variant Price': '',
//             'Variant Compare At Price': '',
//             'Variant Requires Shipping': '',
//             'Variant Taxable': '',
//             'Variant Barcode': '',
//             'Image Src': cover_image,
//             'Image Position': '',
//             'Image Alt Text': title,
//             'Gift Card': '',
//             'SEO Title': `${title} | Village Record Club`,
//             'SEO Description': `${title} is available to add to your wishlist.`,
//             'Google Shopping / Google Product Category': '',
//             'Google Shopping / Gender': '',
//             'Google Shopping / Age Group': '',
//             'Google Shopping / MPN': '',
//             'Google Shopping / AdWords Grouping': '',
//             'Google Shopping / AdWords Labels': '',
//             'Google Shopping / Condition': '',
//             'Google Shopping / Custom Product': '',
//             'Google Shopping / Custom Label 0': '',
//             'Google Shopping / Custom Label 1': '',
//             'Google Shopping / Custom Label 2': '',
//             'Google Shopping / Custom Label 3': '',
//             'Google Shopping / Custom Label 4': '',
//             'Variant Image': '',
//             'Variant Weight Unit': '',
//             'Variant Tax Code': '',
//             'Cost per item': '',
//             'Price / International': '',
//             'Compare At Price / International': '',
//             'Status': 'Active'
//         };

//         await csvProductWriter.writeRecords([product])
//             .then(async () => {
//                 console.log(`Image src updated in ${productsCsvFile}.`);
//                 await index++;
//             })
//             .catch(err => {
//                 console.error(`Error updating Image src in ${productsCsvFile}:`, err);
//             });
    
//     } else {
//         // if spotify image search returns null, save title to rejects txt file
//         await rejectsTxtWriter.writeRecords([{title: albumTitles[index]}])
//             .then(async () => {
//                 console.log(`Album saved to ${rejectsTxtFile}.`);
//                 await index++;
//             })
//             .catch(err => {
//                 console.error('Error saving album to rejects.txt:', err);
//             })
//     }       
    
//     if (index < albumTitlesLength) {
//         setTimeout(main, 2109);
//     } else {
//         console.log('Done.');
//     }
// }


