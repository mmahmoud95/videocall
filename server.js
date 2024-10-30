const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('offer', (data) => {
    socket.to(data.room).emit('offer', data.offer);
  });

  socket.on('answer', (data) => {
    socket.to(data.room).emit('answer', data.answer);
  });

  socket.on('candidate', (data) => {
    socket.to(data.room).emit('candidate', data.candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
