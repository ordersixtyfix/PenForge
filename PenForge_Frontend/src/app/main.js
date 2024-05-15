const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    // BrowserWindow oluştur
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,  // Node.js entegrasyonunu devre dışı bırak
            contextIsolation: true,  // Context izolasyonunu etkinleştir
            preload: path.join(__dirname, 'preload.js')  // Güvenli bir şekilde Node.js ve DOM API'leri arasında köprü oluştur
        }
    });

    // mainWindow yüklemek için login.html dosyasını belirtin
    mainWindow.loadFile('src/app/welcome/welcome.html');

    // Varsayılan menüyü kaldır
    Menu.setApplicationMenu(null);
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
