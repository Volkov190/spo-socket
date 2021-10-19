const {Server} = require('ws');
const net = require('net');

const wss = new Server({port:2000});

wss.on('connection', (wscli) => {
    const client = new net.Socket();
    let login = undefined;

    client.connect(3000, '127.0.0.1', () => {

        const startMessage = {
            type: 'start',
        };
        client.write(JSON.stringify(startMessage));
    });

    client.on('data', (data) => {
        data = Buffer.from(data).toString();
        data = JSON.parse(data);

        if (data['type'] === 'start') {
            wscli.send(JSON.stringify(data));
        }

        if (data['type'] === 'signin') {
            if (data.result) {
                login = data.login;
            }
            wscli.send(JSON.stringify(data));
        }

        if (data['type'] === 'signup') {
            wscli.send(JSON.stringify(data));
        }

        if (data['type'] === 'newmessage') {
            wscli.send(JSON.stringify(data));
        }
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    wscli.addListener('message', (message) => {
        message = JSON.parse(Buffer.from(message).toString());

        if (message.type === 'signin') {
            client.write(JSON.stringify(message));
        }

        if (message.type === 'signup') {
            client.write(JSON.stringify(message));
        }

        if (message.type === 'newmessage' && login) {
            message.author = login;
            client.write(JSON.stringify(message));
        }

        if (message.type === 'logout' && login) {
            login = undefined;
        }

        if (message.type === 'remove' && login) {
            message['login'] = login;
            client.write(JSON.stringify(message));
            login = undefined;
        }
    });

    wscli.addEventListener('close', (ev) => {
        const endMes = {
            type: 'end',
        }
        client.write(JSON.stringify(endMes));
    });
})
