const os = require('os');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res, next){
  console.log('get route');
  res.send('nothing here. use app.html');
  res.end();
});

io.on('connection', function(socket){
  console.log('a user connected');

  setInterval(function() { 
      socket.emit('metric', os.loadavg());
  }, 1000);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
