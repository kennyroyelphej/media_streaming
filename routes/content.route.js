const express = require('express');
const controller = require('../controllers/content.controller');
const uploaderUtils = require('../utilities/uploader.utility');
const router = express.Router();

router.post('/upload', uploaderUtils.upload.single("file"), controller.uploadNewContent);

module.exports = router;
