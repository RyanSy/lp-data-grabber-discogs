const search = require('./search');
const titles = require('./inventory');
const writeCSV = require('write-csv');
const titlesLength = titles.length;
const products = [];

async function main() {
    // perform 60 searches at a time, write data to csv, then delete those elements from the array
    for (let i = 0; i < titlesLength; i++) {
        const album = await search.searchDiscogs(titles[i]);
        const format = album.format.join();
        const label = album.label.join();
        const genre = album.genre.join();
        const style = album.style.join();
        const title = album.title;
        const cover_image = album.cover_image;
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

        await products.push(product);

        await titles.splice(0, 59);
    }

    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US');
    const dateTime = `${date}-${time}`;

    try {
        console.log('Writing to .csv file...');
        writeCSV(`./csv/${dateTime}.csv`, products);
    } catch (err) {
        console.error('Error writing to .csv file:', err);
    }
}

setInterval(main, 61000);
