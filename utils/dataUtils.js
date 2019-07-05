export const arrayParser = array => array.reduce((acc, value) => {
  const { url, timestamp, delay} = value;
  if (acc[url]) {
    return { ...acc, [url]: [ ...acc[url], { timestamp, delay } ] };
  }

  return { ...acc, [url]: [{ timestamp, delay }] };
  }, {}
);
