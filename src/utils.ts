export enum WindowName {
  login_register = 'login_register',
  main = 'main',
}

export const openLoginWindow = () => {
  window.$client.openWindow(WindowName.login_register);
  window.$client.closeWindow();
};

export const openMainWindow = () => {
  window.$client.openWindow(WindowName.main);
  window.$client.closeWindow();
};
