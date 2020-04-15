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

            setInterval(() => {

                const choice = namesArray[Math.floor(Math.random() * namesArray.length)];

                const readStream = gfs.openDownloadStreamByName(choice);
                const fs_write_stream = fs.createWriteStream(path.join(__dirname, `/fromdb/${choice}`));
                readStream.pipe(fs_write_stream);

                fs_write_stream.on('close', function () {
                    const image_path = path.join(__dirname, '/fromdb/' + choice);
                    const b64content = fs.readFileSync(image_path, { encoding: 'base64' });

                    T.post('media/upload', { media_data: b64content }, (err, data, response) => {
                        if (err) {
                            console.log(`Error: ${err}`);
                        } else {
                            T.post('statuses/update', {
                                status: 'ongoing tests',
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

                });
            }, 43200000);

        });
    });
}

upload_random_image();