const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let tagData = {}; // { tag: [ { user: 'name', data: 'info' }, ... ] }

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const { type, tag, user, info } = data;

        if (type === 'addTag') {
            if (!tagData[tag]) tagData[tag] = [];
            tagData[tag].push({ user, data: info });
            // Broadcast updated tag info to all clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ tag, users: tagData[tag] }));
                }
            });
        }

        if (type === 'getTagInfo') {
            if (tagData[tag]) {
                ws.send(JSON.stringify({ tag, users: tagData[tag] }));
            } else {
                ws.send(JSON.stringify({ tag, users: [] }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(30180, () => {
    console.log('Server is listening on port 30180');
});
//uwu.freeserver.tw:21249