const Twit = require('twit');
const fs = require('fs');
const path = require('path');


const config = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

const T = new Twit(config);


const random_from_array = images => images[Math.floor(Math.random() * images.length)];


const upload_random_image = (images, statusText) => {
    console.log('Fetching a random image');
    const image_path = path.join(__dirname, '/images/' + random_from_array(images));

    console.log('Encoding the image');
    const b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    console.log('Uploading the image as media on twitter');
    T.post('media/upload', { media_data: b64content }, (err, data, response) => {
        if (err) {
            console.log('ERROR:');
            console.log(err);
        } else {
            console.log('Posting that media with a status');
            T.post('statuses/update', {
                status: statusText,
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
};

const loadImages = () => {
    fs.readdir(__dirname + '/images', (err, files) => {
        if (err) {
            console.log(err);
        } else {
            const images = [];
            files.forEach(f => {
                images.push(f);
            });
            return images;
        }
    });
}

const imagesArray = loadImages();

setInterval(() => {
    upload_random_image(imagesArray, 'Daily Yukine');
}, 82800000);

const stream = T.stream('user');
stream.on('tweet', replyZenbu);


const replyZenbu = msgContent => {
    const replyto = msgContent.in_reply_to_screen_name;
    const text = msgContent.text.toLowerCase();
    const from = msgContent.user.screen_name;

    console.log(replyto + ' ' + from);

    if (replyto === 'yukinebotine' && text.includes('post chris')) {
        const statusText = `@${from} Zenbu!`;
        upload_random_image(imagesArray, statusText);
    }
}
