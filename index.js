const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST']
  }
});

const users = {};

io.on('connection', socket => {
  console.log('New connection:', socket.id);

  socket.on('new-user-joined', name => {
    console.log('New user:', name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    console.log('Message received:', message);
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', users[socket.id]);
    socket.broadcast.emit('user-left', users[socket.id]);
    delete users[socket.id];
  });
});
