require('dotenv').config()

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

    const Recaptcha = require('express-recaptcha');
    
    const recaptcha = new Recaptcha(
        process.env.SITE_KEY, 
        process.env.SECRET_KEY
    );
    recaptcha.verify(req, function(error, data){
        if(!error) {
            res.end('https://pic.tzhongyan.com/photo/' + req.file.filename);
        } else {
            res.status(417);
            res.send('Recaptcha failed');
        }
    });
});

/**
 * Serving the uploaded file
 */
app.use('/photo', express.static(__dirname + '/photos'));

app.listen(5000, () => {
    console.log('Working on port 5000');
});
