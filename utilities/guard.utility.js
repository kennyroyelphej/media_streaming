function storage(req, res, next) {
    console.log("Flowed through Guard")
    next();
}

module.exports = {
    storage: storage
}