const net = require('net');
const express = require('express');
const path = require('path');

const tobj = { 
    type :'signin',
    login: 'test_login',
    password: 'test_password',
}

const client = new net.Socket();
client.connect(3000, '127.0.0.1', () => {
    console.log('Connected');
    // client.write('Hello. Nu sho?');
    client.write(JSON.stringify(tobj));
});

client.on('data', (data) => {
    console.log('Recieved: ', Buffer.from(data).toString('utf-8'));
    client.destroy();                                                   //debug
});

client.on('close', () => {
    console.log('Connection closed');
});