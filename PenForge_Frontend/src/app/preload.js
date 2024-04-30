const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendLoginData: (data) => ipcRenderer.send('login-data', data),
    receiveLoginResponse: (func) => ipcRenderer.on('login-response', (event, ...args) => func(...args))
});
