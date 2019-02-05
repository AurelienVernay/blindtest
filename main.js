const { app, BrowserWindow } = require('electron');
let win;
console.log('Bootstrapping electron');
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 600,
        height: 600,
        backgroundColor: '#ffffff',
        icon: `file://${__dirname}/dist/blindtest/favicon.png`,
    });

    win.loadURL(`file://${__dirname}/dist/blindtest/index.html`);
    //// uncomment below to open the DevTools.
    // win.webContents.openDevTools()

    // Event when the window is closed.
    win.on('closed', function() {
        win = null;
    });
}

// Create window on electron intialization
app.on('ready', () => {
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit();
        // dbClient.close();
        // expressApp.close();
    }
});

app.on('activate', function() {
    // macOS specific close process
    if (win === null) {
        createWindow();
    }
});
