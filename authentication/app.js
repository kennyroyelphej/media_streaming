const express = require('express');
const app = express();

app.use(express.urlencoded());

app.post('/authentication', (req, res) => {
    const streamkey = req.body.key;
    if (streamkey === 'supersecret') {
        res.status(200).send();
        return;
    }
    res.status(403).send();
})

app.listen(8000, () => {
    console.log('Server listen to port 8000')
})