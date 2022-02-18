const { exec } = require('child_process');

function upload(req, res) {
    if (req.file.filename) {
        res.status(201).json({
            message: "file uploaded successfully"
        })
    }
    else {
        res.status(500).json({
            message: "something went wrong"
        })
    }
    exec(`sh ./utils/convert.util.sh ${req.file.filename.split(".")[0]}`, (err, stdout, stderr) => {
        if (err) { console.error(err) }; console.log('stdout', stdout); console.log('stderr', stderr)
    })
}

module.exports = {
    upload: upload
}
