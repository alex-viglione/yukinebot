console.log('Hey I\'m here');

const Twit = require('twit');
const fs = require('fs');
const path = require('path');
const config = require('./config');


const T = new Twit(config);


const random_from_array = images => images[Math.floor(Math.random() * images.length)];


const upload_random_image = images => {
    console.log('Opening an image...');
    const image_path = path.join(__dirname, '/images/' + random_from_array(images));
    const b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    console.log('Uploading an image...');

    T.post('media/upload', { media_data: b64content }, (err, data, response) => {
        if (err) {
            console.log('ERROR:');
            console.log(err);
        } else {
            console.log('Image uploaded');
            console.log('Tweeting the image...');

            T.post('statuses/update', {
                status: 'Yukinode.js posting a picture',
                media_ids: new Array(data.media_id_string)
            },
                (err, data, response) => {
                    if (err) {
                        console.log('Error:');
                        console.log(err);
                    } else {
                        console.log('Posted an image!');
                    }
                }
            );
        }
    });
}

fs.readdir(__dirname + '/images', (err, files) => {
    if (err) {
        console.log(err);
    } else {
        const images = [];
        files.forEach(f => {
            images.push(f);
        });

        setInterval(() => {
            upload_random_image(images);
        }, 86400000);
    }
})