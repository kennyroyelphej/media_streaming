const multer = require('multer');
const path = require('path');
const fs = require('fs')

let name;

const storage = multer.diskStorage({
    destination: function (req, file, calbk) {
        name = new Date().getTime().toString()
        fs.mkdirSync(path.join('public', 'storage', name))
        calbk(null, path.join('public', 'storage', name));
    },
    filename: function (req, file, calbk) {
        calbk(null, name + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, calbk) => {
    if (file.mimetype === 'video/mp4') {
        calbk(null, true);
    }
    else {
        calbk(new Error('Unsupported file'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = { upload: upload }