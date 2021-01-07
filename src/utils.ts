export enum WindowName {
  login_register = 'login_register',
  main = 'main',
}

export const closeWindow = (name: WindowName) => window.$client.closeWindow(name);

export const openWindow = (name: WindowName) => window.$client.closeWindow(name);
