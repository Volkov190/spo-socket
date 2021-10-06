const net = require('net');
const http = require('http');
// const express = require('express');
const path = require('path');
const ws = require('ws');
const fs = require('fs').promises;
// const wss = new ws.Server({noServer: true});
const {Server} = require('ws');

const wss = new Server({port:2000});

wss.on('connection',(cli) => {
    console.log('Client connected');
    let mes = 0;
    setInterval(() => cli.send(`Message: ${++mes}`), 1000);

})

// const server = http.createServer((req, res) => {
//     // console.log(req.body);
//     // res.readFile();
//     // res.write(path.resolve(__dirname, 'front', 'index.html'))
//     fs.readFile(path.resolve(__dirname, 'front', 'index.html')).then((cont) => res.end(cont));
//     wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
// });

// server.listen(2000, '127.0.0.1');

// function onSocketConnect(ws) {
//     console.log('Client connected');
// }



/*const port = 2000;
const app = express();
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'front', 'index.html'));
});

app.post('/', urlencodedParser, (req, res) => {
    console.log(req.body);

    const client = new net.Socket();
    client.connect(3000, '127.0.0.1', () => {
        console.log('Connected');
        client.write(`login=${req.body.login}&password=${req.body.password}`);
    });

    client.on('data', (data) => {
        console.log('Recieved: ', Buffer.from(data).toString('utf-8'));
        client.destroy();
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    res.sendFile(path.resolve(__dirname, 'front', 'index.html'));
});

app.use('/', router);
app.use(express.static(path.resolve(__dirname, 'front')));

app.listen(port, () => {
    console.log('Server start...');
});*/

// const client = new net.Socket();
// client.connect(2000, '127.0.0.1', () => {
//     console.log('Connected');
//     client.write('Hello. Nu sho?');
// });

// client.on('data', (data) => {
//     console.log('Recieved: ', Buffer.from(data).toString('utf-8'));
//     client.destroy();
// });

// client.on('close', () => {
//     console.log('Connection closed');
// });