const express = require('express');
const multer = require('multer');
const path = require('path');
//
const app = express();
app.set('view engine', 'ejs');
// file upload location
const UPLOADS_FOLDER = './uploads';

// new method
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-');

        cb(null, `${fileName}-${Date.now()}${fileExt}`);
    },
});

// old method
const upload = multer({
    storage,
    limits: {
        fileSize: 100000000,
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            if (
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg'
            ) {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }
        if (file.fieldname === 'doc') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            }
            return cb(new Error('Only .pdf format allowed!'));
        }
    },
});

app.get('/', (req, res) => {
    res.render('fileUpload');
});

// mutiple file fild
// app.post(
//     '/upload-file',
//     upload.fields([
//         { name: 'avatar', maxCount: 1 },
//         { name: 'doc', maxCount: 4 },
//     ]),
//     (req, res) => {
//        console.log(req.files);
//         res.send('Hello World');
//     },
// );
app.post('/upload-file', upload.single('avatar'), (req, res) => {
    console.log(req.file.path);
    res.send('Hello World');
});

// error hendel
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send('There was an upload error!');
        } else {
            res.status(500).send(err.message);
        }
    } else {
        res.send('Success');
    }
});

app.listen(3000, () => {
    console.log('app listening at port 3000');
});
