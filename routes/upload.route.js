const express = require('express');
const controller = require('../controllers/upload.controller');
const storage = require('../utils/storage.util');
const router = express.Router();

router.post('/content', storage.upload.single('content'), controller.upload);

module.exports = router;