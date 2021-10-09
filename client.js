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
    // setInterval(() => cli.send(`Message: ${++mes}`), 1000);
    cli.send(`{"type": "start", "result": [{"text": "Test messages", "author": "Kirusha"}, {"text": "It work", "author": "Sanya"}]}`);

    cli.addListener('message', (message) => {
        console.log(JSON.parse(Buffer.from(message).toString()));
    });
})