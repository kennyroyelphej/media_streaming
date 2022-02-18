//Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down the server due to uncaught exceptions');
    process.exit(1)
})

//Setting up Environment_Config file
const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });
if (dotenv.error) { throw result.error }

const app = require('./app');

const http = require('http')
const server = http.createServer(app);

server.listen(process.env.APP_PORT, () => {
    console.log(
        `\nNode Application Started @...`,
        `\n - Scheme: ${process.env.APP_SCHEME}`,
        `\n - Port: ${process.env.APP_PORT}`,
        `\n - Environment: ${process.env.APP_ENV}`
    )
})

//Unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1)
    })
})