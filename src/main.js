const albumTitles = require('./albumTitles');
const albumTitlesLength = albumTitles.length;
let index = 0;
const search = require('./search');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const date = new Date().toISOString().split('T')[0];
const time = new Date().toLocaleTimeString('en-US');
const dateTime = `${date}-${time}`;
const productsCsvFile = `products-${dateTime}.csv`;
const rejectsTxtFile = `rejects-${dateTime}.txt`;



// creates a blank file to save data to
async function createFile(filename, content) {
    const filePath = path.join(__dirname, `../../data-grabber-files/${filename}`); // Use path.join for cross-platform compatibility
  
    await fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error("Error creating file:", err);
        return;
      }
      console.log(`File "${filename}" created successfully at ${filePath}`);
    });
}



// write products to a csv file
const csvProductWriter = createCsvWriter({
    path: path.join(__dirname, `../../data-grabber-files/${productsCsvFile}`),
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



// write products not to a txt file
const rejectsTxtWriter = createCsvWriter({
    path: path.join(__dirname, `../../data-grabber-files/${rejectsTxtFile}`),
    header: ['title']
});


// main function
async function main() {
    // search Discogs for album info
    // const album = await search.getDiscogsData(albumTitles[index]);

    // search Spotify for cover art
    const spotifyAccessToken = await search.getSpotifyAccessToken();
    const coverArtUrl = await search.getSpotifyCoverArt(spotifyAccessToken, albumTitles[index]);

    // if album info is not null, save product to products csv file
    if (album !== null) {
        const format = album.format.join();
        const label = album.label.join();
        const genre = album.genre.join();
        const style = album.style.join();
        const title = album.title;
        const cover_image = coverArtUrl;
        const product = {
            'Handle': title,
            'Title': title,
            'Body (HTML)': '',
            'Vendor': 'Village Record Club',
            'Product Category': 'Media > Music & Sound Recordings > Records & LPs',
            'Type': 'album',
            'Tags': `${format}, ${label}, ${genre}, ${style}`,
            'Published': '',
            'Option1 Name': '',
            'Option1 Value': '',
            'Option2 Name': '',
            'Option2 Value': '',
            'Option3 Name': '',
            'Option3 Value': '',
            'Variant SKU': '',
            'Variant Grams': '',
            'Variant Inventory Tracker': '',
            'Variant Inventory Qty': '',
            'Variant Inventory Policy': 'deny',
            'Variant Fulfillment Service': 'manual',
            'Variant Price': '',
            'Variant Compare At Price': '',
            'Variant Requires Shipping': '',
            'Variant Taxable': '',
            'Variant Barcode': '',
            'Image Src': cover_image,
            'Image Position': '',
            'Image Alt Text': title,
            'Gift Card': '',
            'SEO Title': `${title} | Village Record Club`,
            'SEO Description': `${title} is available to add to your wishlist.`,
            'Google Shopping / Google Product Category': '',
            'Google Shopping / Gender': '',
            'Google Shopping / Age Group': '',
            'Google Shopping / MPN': '',
            'Google Shopping / AdWords Grouping': '',
            'Google Shopping / AdWords Labels': '',
            'Google Shopping / Condition': '',
            'Google Shopping / Custom Product': '',
            'Google Shopping / Custom Label 0': '',
            'Google Shopping / Custom Label 1': '',
            'Google Shopping / Custom Label 2': '',
            'Google Shopping / Custom Label 3': '',
            'Google Shopping / Custom Label 4': '',
            'Variant Image': '',
            'Variant Weight Unit': '',
            'Variant Tax Code': '',
            'Cost per item': '',
            'Price / International': '',
            'Compare At Price / International': '',
            'Status': 'Active'
        };

        await csvProductWriter.writeRecords([product])
            .then(async () => {
                console.log(`Album saved to ${productsCsvFile}.`);
                await index++;
            })
            .catch(err => {
                console.error(`Error saving album to products.csv:`, err);
            });
    
    } else {
        // if album info returns null, save title to rejects txt file
        await rejectsTxtWriter.writeRecords([{title: albumTitles[index]}])
            .then(async () => {
                console.log(`Album saved to ${rejectsTxtFile}.`);
                await index++;
            })
            .catch(err => {
                console.error('Error saving album to rejects.txt:', err);
            })
    }       
    
    if (index < albumTitlesLength) {
        setTimeout(main, 2109);
    } else {
        console.log('Done.');
    }
}

// let's go
createFile(productsCsvFile, '');

createFile(rejectsTxtFile, '');

main();

