const express = require('express')
const app = express()
const port = 3005

const fs = require('fs')
const viewPath = '/view/index.html'
const filePath = 'storage/Hello_world.mp4'

app.get('/', (req, res) => {
    res.sendFile(__dirname + viewPath)
})

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) { res.status(400).send('Requires range in headers') }

    const fileSize = fs.statSync(filePath).size
    const chunkSize = 10 ** 6
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + chunkSize, fileSize - 1)
    const contentLength = end - start + 1

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers)

    const videoStream = fs.createReadStream(filePath, { start, end });
    videoStream.pipe(res)
})

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})