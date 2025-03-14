// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // Import the uuid package

const ipBlackList=[/*Ipv4 here*/]

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

Array.prototype.remove = function(a) {
    const i = this.indexOf(a);
    return i !== -1 && this.splice(i, 1);
};

class Tags {
    constructor(id, tag, nick, s, x, y,server,ip) {
        this.id = id
        this.tag = tag
        this.nick = nick
        this.s = s
        this.x = x
        this.y = y
        this.server = server
        this.ip = ip
        this.ex = 3
    }
}
const taggers = {
    byId: new Map(),
    list: [],
};

setInterval(() => {
    for(const cc of taggers.list){
        if(--cc.ex <= 0){
            taggers.list.remove(taggers.byId.get(cc.id))
            taggers.byId.delete(cc.id);
        }
    }
}, 1000);

wss.on('connection', (ws) => {
    const sessionId1 = uuidv4(); // Generate a unique session ID
    const sessionId2 = uuidv4(); // Generate a unique session ID
    ws.send(JSON.stringify({ type: 'sessionId', sessionId1 , sessionId2 }));

    console.log(`Client connected with session ID: ${sessionId1} and ${sessionId2}`);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const { type, tag, id1, id2, nick,s,x,y,nick2,s2,x2,y2,server,ip } = data;
        if (type === 'init'){
            console.log(`Client connected with IP: ${ip}, with nicknames: ${nick} and ${nick2}`);
            if(ipBlackList.includes(ip))ws.send(JSON.stringify({ type: 'red', link:"https://www.youtube.com/watch?v=dQw4w9WgXcQ" }));
        }
        if (type === 'core') {
            if(s&&s>9&&tag!=""){
                if(taggers.byId.has(id1)){
                    taggers.byId.get(id1).tag=tag
                    taggers.byId.get(id1).nick=nick
                    taggers.byId.get(id1).s=s
                    taggers.byId.get(id1).x=x
                    taggers.byId.get(id1).y=y
                    taggers.byId.get(id1).server=server
                    taggers.byId.get(id1).ex=3
                }else{
                    const cell = new Tags(id1, tag, nick, s, x, y,server,ip);
                    taggers.byId.set(id1, cell);
                    taggers.list.push(cell)
                    console.log("tag: %s, name: %s, server: %s,ip: %s, player1 registered", cell.tag, cell.nick, cell.server, cell.ip)
                }
            }
            if(s2&&s2>9&&tag!=""){
                if(taggers.byId.has(id2)){
                    taggers.byId.get(id2).tag=tag
                    taggers.byId.get(id2).nick=nick2
                    taggers.byId.get(id2).s=s2
                    taggers.byId.get(id2).x=x2
                    taggers.byId.get(id2).y=y2
                    taggers.byId.get(id2).server=server
                    taggers.byId.get(id2).ex=3
                    //console.log(taggers)
                }else{
                    const cell = new Tags(id2, tag, nick2, s2, x2, y2,server,ip);
                    taggers.byId.set(id2, cell);
                    taggers.list.push(cell)
                    console.log("tag: %s, name: %s,server: %s,ip: %s, player2 registered", cell.tag, cell.nick, cell.server, cell.ip)
                }
            }
        }
    if (type === 'getcore') {
        if(ipBlackList.includes(ip))ws.send(JSON.stringify({ type: 'red', link:"https://www.youtube.com/watch?v=dQw4w9WgXcQ" }));
        for(const cell of taggers.list){
            if(tag==cell.tag&&server==cell.server)
            ws.send(JSON.stringify({tag:cell.tag,id:cell.id, nick:cell.nick,s:cell.s,x:cell.x,y:cell.y}));
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
