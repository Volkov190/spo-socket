const {Server} = require('ws');

const wss = new Server({port:2000});

wss.on('connection',(cli) => {
    console.log('Client connected');
    let mes = 0;
    // setInterval(() => cli.send(`Message: ${++mes}`), 1000);
    // cli.send(`{"type": "start", "result": [{"text": "Test messages", "author": "Kirusha"}, {"text": "It work", "author": "Sanya"}]}`);
    cli.send(`{"type": "login", "result": "True", "login": "Sanya"}`);

    cli.addListener('message', (message) => {
        console.log(JSON.parse(Buffer.from(message).toString()));
    });
})