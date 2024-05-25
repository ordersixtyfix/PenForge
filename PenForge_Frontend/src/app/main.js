const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

axios.defaults.maxRedirects = 0;  // Maksimum yönlendirme sayısını sınırla

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('src/app/test-builder/test-builder.html');
    Menu.setApplicationMenu(mainMenu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Menü şablonunu tanımla
const mainMenu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click() {
                    mainWindow.reload();
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: 'CmdOrCtrl+I',
                click() {
                    mainWindow.webContents.toggleDevTools();
                }
            }
        ]
    }
]);

// API isteklerini işleme
ipcMain.handle('forgot-password-request', async (event, data) => {
    try {
        const response = await axios.post('http://localhost:8888/api/forgot-password/request', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data;
    } catch (error) {
        return { error: error.message };
    }
});

ipcMain.handle('validate-token-request', async (event, data) => {
    try {
        const response = await axios.post('http://localhost:8888/api/forgot-password/validate-token', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data;
    } catch (error) {
        return { error: error.message };
    }
});

ipcMain.handle('reset-password-request', async (event, data) => {
    try {
        const response = await axios.post('http://localhost:8888/api/forgot-password/reset-password', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data;
    } catch (error) {
        return { error: error.message };
    }
});

ipcMain.handle('logout', async (event) => {
    try {
        const response = await axios.post('http://localhost:8888/api/logout');
        console.log("Logout response:", response.data); // Hata ayıklama için log ekleyelim
        return response.data;
    } catch (error) {
        console.error("Logout error:", error.message); // Hata mesajını konsola yazdıralım
        return { error: error.message };
    }
});
