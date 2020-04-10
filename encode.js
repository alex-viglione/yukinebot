require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const postData = (img64, name) => {
    axios.post(`${process.env.DB_HOST}/images.json`, {
        name: name,
        value: img64
    })
        .then(res => console.log(`Status: ${res.status} | Data succesfully stored.`))
        .catch(e => console.log('An error occurred in posting the data: ', e.message));
}

fs.readdir(`${__dirname}/images`, (err, files) => {
    if (err) {
        console.log(err);
    } else {
        let name = 1;
        files.forEach(f => {
            const image_path = path.join(__dirname, `/images/${f}`);
            const b64string = fs.readFileSync(image_path, { encoding: 'base64' });
            postData(b64string, name);
            name++;
        });
    }
});