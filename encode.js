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

conn.once('open', function () {
    console.log('- Connection open -');
    const gfs = new mongoose.mongo.GridFSBucket(conn.db);

    fs.readdir(`${__dirname}/${process.env.PICS_FOLDER}`, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            files.forEach(f => {
                const image_path = path.join(__dirname, `/${process.env.PICS_FOLDER}/${f}`);

                const writeStream = gfs.openUploadStream(f);

                fs.createReadStream(image_path).pipe(writeStream);

                writeStream.on('finish', function (file) {
                    console.log(`${file.filename} stored to db`);
                });
            });
        }
    });
});