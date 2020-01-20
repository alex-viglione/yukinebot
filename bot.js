const Twit = require('twit');
const fs = require('fs');
const path = require('path');

const config = require('./config');

const T = new Twit(config);

// Returning a random filename
const random_from_array = images => images[Math.floor(Math.random() * images.length)];


const upload_random_image = (images, statusText) => {
    // Fetching a random image's file name and path
    const image_path = path.join(__dirname, '/images/' + random_from_array(images));

    // Encoding the file
    const b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    // Uploading the image as media on twitter
    T.post('media/upload', { media_data: b64content }, (err, data, response) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            // Posting that media with a status
            T.post('statuses/update', {
                status: statusText,
                media_ids: new Array(data.media_id_string)
            },
                (err, data, response) => {
                    if (err) {
                        console.log(`Error: ${err}`);
                    } else {
                        console.log('Posted an image!');
                    }
                }
            );
        }
    });
};

// BOT PART
fs.readdir(__dirname + '/images', (err, files) => {
    if (err) {
        console.log(err);
    } else {
        // Pushing filenames into a new array to contain them all
        const images = [];
        files.forEach(f => {
            images.push(f);
        });
        
        setInterval(() => {
            upload_random_image(images, 'Testing in progress...');
        }, 60000);
    }
});