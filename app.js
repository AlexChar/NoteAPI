const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const notes = require('./notes').notes;
const port = 3000;
let noteCounter = 1;
const intervals = [];
let users = [];
let usersCounter = 0;

// allow requests from different domains
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// parse application/json
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => res.send('notes api'));

intervals.push(
  setInterval(function () {
    const newNote = {
      title: `system note ${noteCounter++}`,
      body: 'this is a socket note',
      userName: 'system note',
      date: +new Date(),
    };
    notes.push(newNote);
    io.sockets.emit('new note', { notes: [newNote] });
  }, 10000)
);

io.on('connection', function (socket) {
  socket.on('disconnect', function (e) {
    console.log('a user has disconnected');
    users = users.filter((user) => user.id !== socket.id);
    io.sockets.emit('connected users', getUsers());
  });
  const user = `user ${++usersCounter}`;
  users.push({
    id: socket.id,
    name: user,
  });

  socket.on('send message', function (userId, msg) {
    const user = users.find((user) => user.id === socket.id);
    socket.to(userId).emit('receive message', { user, msg });
  });

  io.sockets.emit('connected users', getUsers());
  console.log('a user connected');
});

app.get('/api/notes', (req, res) => res.send({ notes }));

app.post('/api/notes', (req, res) => {
  if (!req.body.title && !req.body.body && !req.body.userName) {
    return res.sendStatus(400);
  }
  const note = {
    ...req.body,
    date: +new Date(),
  };
  notes.push(note);
  io.sockets.emit('new note', { notes: [note] });
  res.sendStatus(200);
});

function getUsers() {
  return { users };
}

server.listen(port, () => console.log(`App listen on port ${port}`));
