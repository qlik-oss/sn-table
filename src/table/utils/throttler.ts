/**
 * Creates a throttled function that only executes 'fn' at most once per every 'wait' milliseconds.
 *
 * @param {function} fn The function to throttle.
 * @param {number} [wait=50] Number of milliseconds to throttle executions to.
 *
 * @returns {function} Returns the new throttled function.
 */
export default function createThrottler(fn: (args: any) => void, wait = 50) {
  let context: any;
  let argus: any;
  let last = 0;
  let timer: any;

  return function throttled(...args: any[]) {
    // @ts-ignore not sure how to set this type
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
