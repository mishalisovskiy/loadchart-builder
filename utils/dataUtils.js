const getLogEntries = array => {
  const parsedArray = array.reduce((acc, value) => {
    const { url, timestamp, delay} = value;
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
      if (index === 1) {
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

module.exports = { getLogEntries };
