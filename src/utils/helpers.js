const forRange = (start, end, cb) =>
  Array(end - start)
    .fill()
    .map((_, i) => cb(start + i));

const shuffle = (a) => {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
};

export default {
  forRange,
  shuffle,
};
