const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendForgotPasswordRequest: (data) => ipcRenderer.invoke('forgot-password-request', data),
    sendValidateTokenRequest: (data) => ipcRenderer.invoke('validate-token-request', data),
    sendResetPasswordRequest: (data) => ipcRenderer.invoke('reset-password-request', data),
    logout: () => ipcRenderer.invoke('logout')
});
