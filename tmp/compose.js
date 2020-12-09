
// koa 中间件调度函数
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
let arr = [];
let middleware = [];
middleware.push(async (context, next) => {
  arr.push(1);
  await next();
  arr.push(4);
});

middleware.push(async (context, next) => {
  arr.push(2);
  await next();
  arr.push(3);
});

compose(middleware)

async function run(params) {
  await compose(middleware)();
  console.log('arr', arr);
}

run();