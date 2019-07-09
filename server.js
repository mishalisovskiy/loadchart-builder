const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cors = require('cors');

const data = require('./routes/data');

const port = process.env.PORT || 4001;
exports.port = port;
// listen to socket connections
io.on('connection', (socket) => {
  console.log('new connection');
});

app.use(cors());
app.use(bodyParser.json());

app.use((request, __response, next) => {
  request.io = io;
  next();
});

app.use('/data', data);

server.listen(port);
console.log(`Listening on port ${port}...`);
