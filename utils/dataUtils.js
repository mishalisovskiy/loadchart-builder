const getLogEntries = array => {
  const parsedArray = array.reduce((acc, { url, timestamp, delay}) => {
    let myUrl = '';
    
    // Removing query params
    myUrl = url.includes('?') ? url.split('?').slice(0, 1).join('') : url;

    // Checking if hash has to be removed
    const re = /\/api\/cart\/(getPaidCart|registerEditDeadline)/;
    if (myUrl.match(re) && myUrl.split('/').length > 3) {
      myUrl = myUrl.trim().split('/').slice(0, 4).join('/');
    }

    if (acc[myUrl]) {
      return { ...acc, [myUrl]: [ ...acc[myUrl], { timestamp, delay } ] };
    }
  
    return { ...acc, [myUrl]: [{ timestamp, delay }] };
    }, {}
  );
  return Object.entries(parsedArray).reduce((acc, value) => {
    const [url, data] = value;
    let tsEnd;
    const delays = [];
    data.forEach(({timestamp, delay}, index) => {
      if (index === 0) {
        tsEnd = timestamp;
        delays.push(delay);
      } else if (timestamp > tsEnd) {
        tsEnd = timestamp;
        delays.push(delay);
      } else {
        delays.push(delay);
      }
    });
    const avgDelay = delays.reduce((acc, value) => acc + value) / delays.length;
    return [...acc, { url, tsEnd, avgDelay }];
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
