const express = require('express'); 
const { PORT, CLIENT_ORIGIN } = require('./config'); 
const bodyParser = require('body-parser'); 
const morgan = require('morgan'); 
const cors = require('cors'); 
const app = express(); 
const server = app.listen(process.env.PORT || 8000)

const socket = require('socket.io');

app.use('/client', express.static('public'));
console.log('server running')
app.use(bodyParser.json());
// app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(morgan('dev')); 


const io = socket(server);

io.sockets.on('connection', newConnection);

const positionRouter = require('./routes/position'); 
app.use('/api/position', positionRouter); 

let dancers  = [];

function Dancer(id, data) {
  this.id = id;
  this.data = data;
}

function newConnection(socket){
  console.log('new connection: ' + socket.id)
  socket.on('mouse', mouseMsg);
  socket.on('game-start', danceStart)
  socket.on('game-update', danceUpdate)
  socket.on('disconnect', removeDancer)

  function mouseMsg (data) {
    socket.broadcast.emit('mouse', data);
    console.log(data)
  }

  function danceStart(data) {
    console.log(socket.id)
    let dancer = new Dancer(socket.id, data)
    dancers.push(dancer)
    setInterval(heartbeat, 10)

    function heartbeat() {
      io.sockets.emit('heartbeat', dancers)
    }
  }
  function danceUpdate(data) {
    let dancer;
    for (var i = 0; i < dancers.length; i++) {
      if (socket.id == dancers[i].id) {
        dancer = dancers[i];
        break;
      }
    }
    dancer.data = data;
  }

  function removeDancer() {
    for (var i = 0; i < dancers.length; i++) {
      if (socket.id == dancers[i].id) {
        dancers.splice(i, 1)
        console.log('disconnected')
        break
      }
    }
}
}



// app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); 