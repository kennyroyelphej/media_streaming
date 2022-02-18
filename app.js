const express = require('express');

const app = express();
app.use(express.json());

app.use('/storage', express.static('./public/storage'));

const route = require('./routes/upload.route');
app.use('/upload', route);

//Error service middleware
const error = require('./utils/res_error.util');
app.use(error)

module.exports = app