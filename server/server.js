const express = require('express');
const http = require('http');
const app = express();
const port = require('./config').PORT;
const route = require('./route');

app.use('/apiv2', route);

app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Server listening on ' + bind);
}
