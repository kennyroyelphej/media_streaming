const express = require('express');

const app = express();
app.use(express.json());

app.set('view engine', 'ejs')

const guard = require('./utilities/guard.utility')

app.use('/storage', guard.storage, express.static('./public/storage'));

app.use('/package', express.static('./public/package'));

app.get('/viewer', (req, res) => { res.render('viewer') })

app.get('/upload', (req, res) => { res.render('upload') })

const content = require('./routes/content.route');
app.use('/content', content);

const error = require('./utilities/error_res.utility');
app.use(error)

module.exports = app