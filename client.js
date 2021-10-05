const net = require('net');
const express = require('express');
const path = require('path');

const port = 2000;
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
});

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