

const express = require('express');

const app = express();

const server = require ('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('CONNECTED TO THE WEB SOCKET');

  socket.on('new message sent', (newMessage) => {
    console.log('NEW MESSAGE', newMessage);

    io.emit('new message relay', newMessage)

  })

});

app.get('/', (req, res, next) => {
  res.sendFile (__dirname + '/index.html')
 
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`LISTENING ON ${PORT}`));
