const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './photos/');
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            cb(
                null,
                raw.toString('hex')
                    + Date.now()
                    + '.'
                    + mime.extension(file.mimetype).toLowerCase()
            );
        });
    },
});


const upload = multer({storage: storage});

let app = express();

/**
 * Showing static view file
 */
app.use('/', express.static(__dirname + '/view/'));

/**
 * Handling files uploaded to server
 */
app.post('/photo', upload.single('photo'), (req, res, next) => {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    res.end('https://pic.tzhongyan.com/photo/' + req.file.filename);
});

/**
 * Serving the uploaded file
 */
app.use('/photo', express.static(__dirname + '/photos'));

app.listen(5000, () => {
    console.log('Working on port 5000');
});
