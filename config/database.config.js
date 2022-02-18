const mongoose = require('mongoose');

function connectDb(req, res) {
    mongoose.connect(
        `${process.env.DB_SCHEME}://${process.env.DB_DOMAIN}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(res => {
            console.log(
                `\nClient Connected @...`,
                `\n - Scheme: ${process.env.DB_SCHEME}`,
                `\n - Domain: ${process.env.DB_DOMAIN}`,
                `\n - Port: ${process.env.DB_PORT}`,
                `\n - Database: ${process.env.DB_NAME}`
            )
        })
}

module.exports = {
    connectDb: connectDb
}