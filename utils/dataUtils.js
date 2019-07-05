export const arrayParser = array => array.reduce((acc, value) => {
  const { url, timestamp, delay} = value;
  if (acc[url]) {
    return { ...acc, [url]: [ ...acc[url], [timestamp, delay] ] };
  }

  return { ...acc, [url]: [[timestamp, delay]] };
  }, {}
);

export class Stack {
  constructor(size) {
    this.$size = size;
    this.$stack = [];
  };
  
  $ensureCanPush = () => (
    this.$stack.length < this.size
  );
  
  $removeFirst = () => {
    const [
      __, ...stack
    ] = this.$stack;
    this.$stack = stack;
  };
  
  push(v) {
    if (!this.$ensureCanPush()) {
      this.$removeFirst();
      this.$stack.push(v);
    }
    this.$stack.push(v);
  };
}
