const express = require('express')
const app = express()
const port = 3005

const fs = require('fs')

const mongodb = require('mongodb')
const dbURL = 'mongodb://localhost:27017/'
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const viewPath = '/view/index.html'
app.get('/', (req, res) => { res.sendFile(__dirname + viewPath) })

app.get('/upload-video', (req, res) => {
    mongodb.MongoClient.connect(dbURL, dbOptions, (error, client) => {
        if (error) {
            res.json(error)
            return
        }
        const db = client.db('videos')
        const bucket = new mongodb.GridFSBucket(db);
        const videoUploadStream = bucket.openUploadStream('world')
        const videoReadStream = fs.createReadStream('./storage/Hello_world.mp4')
        videoReadStream.pipe(videoUploadStream)
        res.status(200).send('Done...')
    })
})

app.get('/download-video/:filename', (req, res) => {
    mongodb.MongoClient.connect(dbURL, dbOptions, (error, client) => {
        if (error) { res.status(500).json(error); return }
        const range = req.headers.range
        if (!range) { res.status(400).send('Requires range in headers') }
        const db = client.db('videos')
        const query = { filename: req.params.filename }
        db.collection('fs.files').findOne(query, (err, video) => {
            if (!video) { res.status(404).send('No videos found'); return }
            const videoSize = video.length
            const start = Number(range.replace(/\D/g, ''))
            const end = videoSize - 1
            const contentLength = end - start + 1
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4"
            }
            res.writeHead(206, headers)
            const bucket = new mongodb.GridFSBucket(db);
            const videoDownloadStream = bucket.openDownloadStreamByName(req.params.filename, { start });
            videoDownloadStream.pipe(res)
        })
    })
})

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})