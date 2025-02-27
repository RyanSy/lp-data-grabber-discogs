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
  rejectsFile: './files/rejects.txt'
};

const productCsvWriter = createCsvWriter({
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

const rejectsTxtWriter = createCsvWriter({
  path: config.rejectsFile
});

/**
 * Initialise script.
 */
function init() {
    console.log('Initiating...');
    console.log(`Preparing to parse CSV file... ${config.inputFile}...`);
  
    fs.createReadStream(config.inputFile)
      .pipe(csv())
      .on('data', (data) => inputCsvJson.push(data))
      .on('end', async () => {
        modifiedCsvJson = inputCsvJson;
        initFunctions();
      });
}

/**
 * Execute functions once data is available.
 */
function initFunctions() {
    console.log('Initiating script...');
    for (let i = 0; i < albumTitlesLength; i++) {
      updateImageUrl(albumTitles[i]);
      if (i === albumTitlesLength) {
        console.log('Done.');
      }
    }
      /**
       * consider using 2 second timeout in case of rate limits
       *     if (index < albumTitlesLength) {
                  setTimeout(main, 2000);
              } else {
                  console.log('Done.');
              }
       */
}

/**
 * Search Spotify API for new image url and update product csv file.
 */
async function updateImageUrl(album) {
    console.log('Starting getNewImageUrl function...');

    const spotifyAccessToken = await search.getSpotifyAccessToken();

    const coverArtUrl = await search.getSpotifyCoverArt(spotifyAccessToken, album).then(data => data);

    if (!coverArtUrl) {
      rejectsTxtWriter.writeRecords([{title: albumTitles[index]}])
    } else {
      modifiedCsvJson = modifiedCsvJson.map(async (item) => {
        const updatedItem = item;
        const itemKey = 'Image Src';
        updatedItem[itemKey] = coverArtUrl;
        productCsvWriter.writeRecords([updatedItem])
        .then(() => {
          console.log('The product CSV file was updated successfully!');
        })
        .catch(err => {
          console.log('Error writing to file:', err);
        });    
      });
    }
}

init();