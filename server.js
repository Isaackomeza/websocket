var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);
// server.on('request', app);
var wss = new WSS({ server, path: '/socket' });
wss.on('connection', function (socket) {
  console.log('Opened Connection 🎉');

  var json = JSON.stringify({ message: 'Gotcha' });
  socket.send(json);
  console.log('Sent: ' + json);

  socket.on('message', function (message) {
    console.log('Received: ' + message);

    wss.clients.forEach(function each(client) {
      var json = JSON.stringify({ message: 'Something changed' });
      client.send(json);
      console.log('Sent: ' + json);
    });
  });

  socket.on('close', function () {
    console.log('Closed Connection 😱');
  });
});

var broadcast = function () {
  var json = JSON.stringify({
    message: 'Hello hello!',
  });

  wss.clients.forEach(function each(client) {
    client.send(json);
    console.log('Sent: ' + json);
  });
};
setInterval(broadcast, 3000);

server.listen(8080, () => console.log('server started'));
