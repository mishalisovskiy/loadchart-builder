export const arrayParser = array => array.reduce((acc, value) => {
  const { url, timestamp, delay} = value;
  if (acc[url]) {
    return { ...acc, [url]: [ ...acc[url], { timestamp, delay } ] };
  }

  return { ...acc, [url]: [{ timestamp, delay }] };
  }, {}
);

export const getLogEntries = object => {
  return Object.entries(object).reduce((acc, value) => {
    const [url, data] = value;
    let tsStart;
    let tsEnd;
    const delays = [];
    const findMinAndMax = data.forEach(({timestamp, delay}, index) => {
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

const arrayOfTestData = [ 
  { url: 'first', timestamp: 562321946359, delay: 10 },
  { url: 'first', timestamp: 562321946323, delay: 7 },
  { url: 'first', timestamp: 562321946127, delay: 5 },
  { url: 'second', timestamp: 562321946359, delay: 3 },
  { url: 'second', timestamp: 562321946323, delay: 5 },
  { url: 'second', timestamp: 562321946100, delay: 4 },
  { url: 'third', timestamp: 562321941234, delay: 8 },
  { url: 'third', timestamp: 562321943456, delay: 7 },
  { url: 'third', timestamp: 562321942341, delay: 9 },
];
