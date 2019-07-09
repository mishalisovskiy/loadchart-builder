const express = require("express");
const http = require("http");

const port = process.env.PORT || 6000;
const data = require('./routes/data');

const app = express();
app.use('/data', data);

const server = http.createServer(app);

server.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = { port };
