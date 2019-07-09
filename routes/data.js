const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');

const server = require('../server');
const { getLogEntries } = require('../utils/dataUtils');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// route: POST /data
// desc: posting new array of requests
router.post('/', async (req, res) => {
  const dataRaw = await readFile(path.resolve(__dirname, '..', 'averagedLogs.json'));
  const data = JSON.parse(dataRaw);
  const logs = getLogEntries(req.body);
  
  // Writing new entries to a file
  logs.forEach((elem) => {
    if (data[elem.url]) {
      if (data[elem.url].logs && data[elem.url].logs.length >= 5) {
        data[elem.url].logs.shift();
        data[elem.url].logs.push({ "tsStart": elem.tsStart, "tsEnd": elem.tsEnd, "avgDelay": elem.avgDelay });
      } else if (data[elem.url].logs) {
        data[elem.url].logs.push({ "tsStart": elem.tsStart, "tsEnd": elem.tsEnd, "avgDelay": elem.avgDelay });
      }
    } else {
      data[elem.url] = { "logs": [{ "tsStart": elem.tsStart, "tsEnd": elem.tsEnd, "avgDelay": elem.avgDelay }] };
    }
  });

  // Calculating average delay for each URL
  Object.entries(data).forEach(([url, urlData]) => {
    const avgDelay = urlData.logs.reduce((acc, value) => { return acc + value.avgDelay }, 0) / urlData.logs.length;
    data[url].prevAvgDelay = data[url].avgDelay;
    data[url].avgDelay = Math.floor(avgDelay);
  });

  await writeFile(path.resolve(__dirname, '..', 'averagedLogs.json'), JSON.stringify(data))
    .then(() => axios.get(`http://localhost:${server.port}/data`))
    .then(res => req.io.emit('New_Data_Available', JSON.stringify(res.data)));
  
  res.json({ msg: 'Logs uploaded' });
});

router.get('/', async (req, res) => {
  const dataRaw = await readFile(path.resolve(__dirname, '..', 'averagedLogs.json'));
  const data = JSON.parse(dataRaw);
  const dataToSend = Object.entries(data).reduce((acc, [url, urlData]) => {
    return ([
    ...acc, {
    url,
    avgDelay: urlData.avgDelay,
    prevAvgDelay: urlData.prevAvgDelay,
    tsEnd: urlData.logs[urlData.logs.length - 1].tsEnd,
    tsStart: urlData.logs[0].tsStart,
  }])}, []);
  res.json(dataToSend);
});

module.exports = router;
