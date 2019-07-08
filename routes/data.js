const router = require('express').Router();
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const { getLogEntries } = require('../utils/dataUtils');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// route: POST /data
// desc: posting new array of requests
router.post('/', async (req, res) => {
  const { entries } = req.body;
  const dataRaw = await readFile(path.resolve(__dirname, '..', 'averagedLogs.json'));
  const data = JSON.parse(dataRaw);
  const logs = getLogEntries(entries);
  
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
  Object.entries(data).forEach(([url, info]) => {
    const avgDelay = info.logs.reduce((acc, value) => { return acc + value.avgDelay }, 0) / info.logs.length;
    data[url].avgDelay = avgDelay;
  });

  await writeFile(path.resolve(__dirname, '..', 'averagedLogs.json'), JSON.stringify(data));
  res.json({ msg: 'Logs uploaded' });
});

router.get('/', async (req, res) => {
  const data = await readFile(path.resolve(__dirname, '..', 'averagedLogs.json'));
  res.json(JSON.parse(data));
});

module.exports = router;
