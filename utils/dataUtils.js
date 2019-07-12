const url = require('url');

const getLogEntries = array => {
  const parsedArray = array.reduce((acc, { url, timestamp, delay}) => {
    const re = /\/api\/cart\/(getPaidCart|registerEditDeadline)/;
    if (url.match(re) && url.split('/').length > 3) {
      url = url.trim().split('/').slice(0, 4).join('/');
    }

    if (acc[url]) {
      return { ...acc, [url]: [ ...acc[url], { timestamp, delay } ] };
    }
  
    return { ...acc, [url]: [{ timestamp, delay }] };
    }, {}
  );
  return Object.entries(parsedArray).reduce((acc, value) => {
    const [url, data] = value;
    let tsStart;
    let tsEnd;
    const delays = [];
    data.forEach(({timestamp, delay}, index) => {
      if (index === 0) {
        tsStart = timestamp;
        tsEnd = timestamp;
        delays.push(delay);
      } else if (timestamp < tsStart) {
        tsStart = timestamp;
        delays.push(delay);
      } else if (timestamp > tsEnd) {
        tsEnd = timestamp;
        delays.push(delay);
      } else {
        delays.push(delay);
      }
    });
    const avgDelay = delays.reduce((acc, value) => acc + value) / delays.length;
    return [...acc, { url, tsStart, tsEnd, avgDelay }];
  }, []);
};

const getApiAndEmit = async (socket) => {
  try {
    const res = await axios.get(`http://localhost:${port}/data`);
    socket.emit("New_Url_Data", res.data); // Emitting a new message. It will be consumed by the client
    console.log(res.data);
  } catch (error) {
    console.error(`${error}`);
  }
};

module.exports = { getLogEntries, getApiAndEmit };
