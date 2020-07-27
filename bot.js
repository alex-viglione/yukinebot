require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const conn = mongoose.connection;

const path = require('path');
const fs = require('fs');

const Twit = require('twit');
const config = require('./config');
const T = new Twit(config);


function postPic(picData) {
    T.post('media/upload', { media_data: picData }, (err, data, response) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            T.post('statuses/update', {
                status: 'Daily Yukine',
                media_ids: new Array(data.media_id_string)
            },
                (err, data, response) => {
                    if (err) {
                        console.log(`Error: ${err}`);
                    } else {
                        console.log('--- Posted an image! Now exiting... ---');
                        process.exit(0);
                    }
                }
            );
        }
    });
}

function encode(path) {
    const b64content = fs.readFileSync(path, { encoding: 'base64' });
    return b64content;
}

function fetchPic(read, write, choice) {
    read.pipe(write);

    write.on('close', function () {
        const image_path = path.join(__dirname, '/fromdb/' + choice);
        const b64 = encode(image_path);
        
        postPic(b64);
    });
}

function upload_random_image() {

    conn.once('open', function () {

        const gfs = new mongoose.mongo.GridFSBucket(conn.db);
        mongoose.model('filename', { filename: String }, 'fs.files');
        const filename = mongoose.model('filename');
        filename.find({}, (err, data) => {

            if (err) {
                console.log('Error: ', err);
            }
            let namesArray = [];
            data.forEach(el => {
                namesArray.push(el.filename);
            });
            const choice = namesArray[Math.floor(Math.random() * namesArray.length)];
            const readStream = gfs.openDownloadStreamByName(choice);
            const fs_write_stream = fs.createWriteStream(path.join(__dirname, `/fromdb/${choice}`));
            fetchPic(readStream, fs_write_stream, choice);

        });

    });

}

upload_random_image();
