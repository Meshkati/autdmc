const express = require('express');
const http = require('http');
const app = express();
const port = require('./config').PORT;
const route = require('./route');
const db = require('./db/db');
var bodyParser = require('body-parser');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/apiv2', route);

app.set('port', port);

const server = http.createServer(app);



db.connect().   // Try to connect to db before initializing http server
then(
    () => {
    server.listen(port);
    server.on('listening', onListening);
}
);


function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Server listening on ' + bind);
}
