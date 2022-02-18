process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down the server due to uncaught exceptions');
    process.exit(1)
})

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });
if (dotenv.error) { throw result.error }

const dbConfig = require('./config/database.config');
dbConfig.connectDb();

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

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected');
    })
});
global.IO = io;

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1)
    })
})