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
// Building schema and model for queued filenames
let schema = new mongoose.Schema({ name: 'string' });
let Filename = mongoose.model('Filename', schema, 'waiting');

const path = require('path');
const fs = require('fs');

const Twit = require('twit');
const config = require('./config');
const T = new Twit(config);

let waiting_list = [];

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

function get_queue_filenames() {
    return Filename.find({}, (err, filenames) => {
        filenames.forEach((fname) => waiting_list.push(fname.name));
    });
}

function delete_first() {
    Filename.countDocuments({}, (err, count) => {
        if (count >= 10)  {
            Filename.deleteOne({name: waiting_list[0]}, (err) => {
                if (err) console.log(err);
            });
        }
    });
}

function push_to_queue(filename) {
    let queued = new Filename({name: filename});
    queued.save((err, file) => {
        if (err) {
            console.log(err)
        } else {
            delete_first();
        }
    });
}

function check_available(array, name) {
    return array.includes(name) ? true : false;
}

function handle_queue(namesArr, choice) {
    get_queue_filenames();
    let promise = new Promise((res, rej) => {
        // Lazy workaround to wait until get_queue_filenames() finished
        setTimeout(() => {
            while (check_available(waiting_list, choice)) {
                choice = namesArr[Math.floor(Math.random() * namesArr.length)];
            }
            res(choice);
        }, 2000);
    });
    return promise;
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
            let choice = namesArray[Math.floor(Math.random() * namesArray.length)];

            handle_queue(namesArray, choice)
            .then((done) => {
                choice = done;
                push_to_queue(done);
                const readStream = gfs.openDownloadStreamByName(choice);
                const fs_write_stream = fs.createWriteStream(path.join(__dirname, `/fromdb/${choice}`));

                fetchPic(readStream, fs_write_stream, choice);
            })
            .catch((err) => console.log(err));

        });

    });

}

upload_random_image();
