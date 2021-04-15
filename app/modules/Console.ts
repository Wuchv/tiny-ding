import colors from 'colors';

export const proxyConsole = (window?: any) => {
  let _console;
  if (window) {
    _console = window.console;
  } else {
    _console = console;
  }
  const colorArray = [
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'gray',
    'grey',
  ];
  return new Proxy(_console, {
    get: (target, propKey) => {
      if (colorArray.includes(propKey as string)) {
        return (...content: any) =>
          target.log((colors as any)[propKey](...content));
      } else {
        return target[propKey];
      }
    },
  });
};
