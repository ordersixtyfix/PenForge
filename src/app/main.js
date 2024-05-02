const { app, BrowserWindow, ipcMain } = require('electron');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: `${__dirname}/preload.js` // Yolu projenize göre ayarlayın
        }
    });

    mainWindow.loadFile('src/app/login/login.html'); // Login sayfası başlangıçta yükleniyor

    ipcMain.on('login-success', () => {
        mainWindow.loadFile('src/app/welcome/welcome.html'); // IPC mesajı ile welcome.html yükleniyor
    });
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
