const encode = require("../utilities/encoder.utility");
const Content = require("../models/content.model")
const path = require('path');

async function uploadNewContent(req, res) {
    if (req.file.filename) {
        let processId = path.basename(req.file.filename, path.extname(req.file.filename))
        let tempJSON = {
            name: JSON.parse(req.body.data).name,
            location: path.join('storage', processId, req.file.filename),
            processId: processId,
            uploaded: true
        }
        const content = await Content.create(tempJSON)
        if (content) {
            res.status(200).json({
                success: true,
                message: "File uploaded successfully",
                encoder: path.basename(req.file.filename, path.extname(req.file.filename))
            })
            encode(req.file.filename);
        }
    }
    else {
        res.status(500).json({ message: "Something went wrong" })
    }
}



module.exports = {
    uploadNewContent: uploadNewContent
}