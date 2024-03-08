const { glob } = require('glob');
const fs = require("fs");
const _ = require('lodash');
const path = require('path');
const sizeOf = require("image-size");
const byteSize = require('byte-size');

const { DefaultImageHasher } = require('./images');

const wait = (delay) => new Promise(resolve => {
    setTimeout(() => resolve(), delay)
})

async function scanFolder(folderPath, onProgress, onDone) {
    onProgress(0);
    
    const images = await glob(folderPath + '/**/*.{png,jpeg,jpg}');
    
    const hasher = new DefaultImageHasher();
    
    const results = [];
    for (let k in images) {
        onProgress(k * 100 / images.length);
        
        const image = images[k];
        
        const hash = await hasher.getHash(image);
        
        console.log('hash', hash);
        
        results.push({ image, hash});
    }
    
    onProgress(100);
    
    function getImageInfos( { image } ) {
        
        const { dir, base } = path.parse( image );
        
        const dimensions = sizeOf(image);
        
        const stats = fs.statSync(image);
        
        return { 
            folder: dir, 
            filename: base, 
            url: 'file://' + image,
            ...dimensions,
            size: `${byteSize(stats.size)}`
        }
        
    }
    
    const output = _.chain(await Promise.all(results))
        .groupBy('hash')
        .filter(r => r.length > 1)
        .map(items => _.map(items, getImageInfos))
        .values()
        .value();
    
    onDone(output);
}

const results = {};

module.exports = {
    "/folders/scan": function(args) {
        
        const { folder } = args;
        const k = 'scan results ' + folder;

        if (!results[k]) {
            results[k] = { progress: 0, output: null };
            scanFolder(
                folder,
                v => results[k].progress = v,
                v => results[k].output = v
            );
        }

        return results[k];
    },
    "/files/delete": ( { folder, filename } ) => new Promise((resolve) => {
        
        const fullpath = path.join(folder, filename);
        
        fs.unlink(fullpath, (err) => {
            if (err) {
                resolve({success: false});
            } else {
                resolve({success: true});
            }
        });

    })

}

