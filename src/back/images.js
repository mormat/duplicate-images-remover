const imghash = require("imghash");
const { exec } = require("child_process");
const yaml = require('yaml');

const run_command = (command) => new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => resolve({error, stdout, stderr}))
})

class ImageMagickImageHasher
{
    async getHash(fullpath) {
        
        console.log('fullpath', fullpath);
        
        const command = `identify -verbose -moments "${fullpath}"`
        
        const { error, stdout } = await run_command(command);
        if (!error) {
            const values = yaml.parse(stdout, {}, {uniqueKeys: false});
            const pHash = values['Image']['Channel perceptual hash'];
            
            return JSON.stringify(pHash);
        }
        
    }
}

class FallbackImageHasher
{
    getHash(file) {
        return imghash.hash(file);
    }
}

module.exports = { DefaultImageHasher: FallbackImageHasher }