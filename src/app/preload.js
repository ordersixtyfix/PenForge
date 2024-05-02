const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendLoginSuccess: () => {
        ipcRenderer.send('login-success');
    }
});
