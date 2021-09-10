const CONSOLEMAPPING = {
  all: {
    zh: '所有',
    en: 'all',
  },
  log: {
    zh: '普通',
    en: 'log',
    color: '#000',
  },
  info: {
    zh: '通知',
    en: 'info',
    color: '#6a5acd',
  },
  warn: {
    zh: '警告',
    en: 'warn',
    color: 'orange',
  },
  error: {
    zh: '错误',
    en: 'error',
    color: '#dc143c',
  },
  debug: {
    zh: '调试',
    en: 'debug',
    color: '#000',
  },
  trace: {
    zh: '追踪',
    en: 'trace',
    color: '#000',
  },
};

const methodList = ['log', 'info', 'warn', 'debug', 'error', 'trace'];

const fakeConsole = {
  time: window.console.time,
  timeEnd: window.console.timeEnd,
  clear: window.console.clear,
};

methodList.forEach(method => {
  fakeConsole[method] = window.console[method];
});

const isString = obj => typeof obj === 'string';

const proxyConsole = () => {
  Object.keys(CONSOLEMAPPING)
    .filter(cmapKey => cmapKey !== 'all')
    .forEach(method => {
      console[method] = (...rest) => {
        let emitProxyConsole = rest.length > 0;
        rest.forEach(val => {
          const isReactSelfConsole =
            isString(val) &&
            (val.indexOf('Check the render method') !== 0 ||
              val.indexOf('Reconciliation') !== 0 ||
              val.indexOf('Cannot update during an existing state transition') !== 0);
          if (!emitProxyConsole && isReactSelfConsole) {
            emitProxyConsole = false;
            return false;
          }
        });
        if (emitProxyConsole) {
          // emit('console', {
          //   type: method,
          //   value: [...rest],
          //   timestamp: new Date().getTime(),
          // });
        }
        fakeConsole[method].apply(window.console, "被劫持了");
        fakeConsole[method].apply(window.console, rest);
      };
    });
};

console.log('111');
proxyConsole()
console.log('111');