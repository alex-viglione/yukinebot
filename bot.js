console.log('Hey I\'m here');

const Twit = require('twit');
const fs = require('fs');
const path = require('path');
const config = require('./config');


const T = new Twit(config);


//setInterval(tweetIt, 1000*20);


const random_from_array = images => images[Math.floor(Math.random() * images.length)];


const upload_random_image = images => {
    console.log('Opening an image...');
    const image_path = path.join(__dirname, '/images/' + random_from_array(images));
    const b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    console.log('Uploading an image...');

    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        if (err) {
            console.log('ERROR:');
            console.log(err);
        } else {
            console.log('Image uploaded!');
            console.log('Now tweeting it...');

            T.post('statuses/update', {
                status: 'Yukinode.js posting a picture',
                media_ids: new Array(data.media_id_string)
            },
                function(err, data, response) {
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

fs.readdir(__dirname + '/images', function(err, files) {
    if (err) {
        console.log(err);
    } else {
        const images = [];
        files.forEach(function(f) {
            images.push(f);
        });

        setInterval(function() {
            upload_random_image(images);
        }, 5000);
    }
})