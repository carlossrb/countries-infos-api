const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function makeString(ll: number) {
  let result = '';
  const { length } = chars;
  for (let i = 0; i < ll; i++) {
    result += chars.charAt(Math.floor(Math.random() * length));
  }
  return result;
}

function makeDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

export { makeString, makeDate };
