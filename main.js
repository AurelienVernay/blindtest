const { app, BrowserWindow } = require('electron');
const backend = require('./backend');
let win;
console.log('Bootstrapping electron');
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        backgroundColor: '#ffffff',
        icon: `http://localhost:9999/favicon.png`,
    });

    win.loadURL(`http://localhost:9999`);
    //// uncomment below to open the DevTools.
    // win.webContents.openDevTools();

    // Event when the window is closed.
    win.on('closed', function() {
        win = null;
    });
}

// Call backend bootstrap with window on electron intialization on callback
app.on('ready', () => {
    backend.bootstrapBackend(createWindow);
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit();
        // backend.expressApp.close();
    }
});

app.on('activate', function() {
    // macOS specific close process
    if (win === null) {
        createWindow();
    }
});
