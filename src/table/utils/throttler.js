/**
 * Creates a throttled function that only executes 'fn' at most once per every 'wait' milliseconds.
 *
 * @param {function} fn The function to throttle.
 * @param {number} [wait=50] Number of milliseconds to throttle executions to.
 *
 * @returns {function} Returns the new throttled function.
 */
export default function createThrottler(fn, wait = 50) {
  let context;
  let argus;
  let last = 0;
  let timer;

  return function throttled(...args) {
    context = this;
    argus = args;

    const delta = Date.now() - last;

    const execute = () => {
      last = Date.now();
      timer = 0;
      fn.apply(context, argus);
    };

    if (!timer) {
      if (delta >= wait) {
        execute();
      } else {
        timer = setTimeout(execute, wait - delta);
      }
    }
  };
}
