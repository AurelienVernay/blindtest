import { environment } from './environments/environment';

//Init MongoDB Client, boot up app after
const MongoClient = require('mongodb').MongoClient;

let dbClient, expressApp;

MongoClient.connect(environment.dbUrl, function(err, client) {
    if (err) throw err;

    dbClient = client.db('blindtest');
    // Express part - serve local endpoints
    const express = require('express');
    expressApp = express();
    const port = environement.expressPort;

    expressApp.get('/blindtests', (req, res) => {
        dbClient
            .collection('blindtest')
            .find()
            .toArray()
            .then(
                result => res.send(result),
                err => {
                    throw err;
                }
            );
    });
    expressApp.get('/blindtests/:blindtestId', (req, res) => {
        dbClient
            .collection('blindtest')
            .findOne({ id: req.params.blindtestId })
            .then(
                result => res.send(result),
                err => {
                    throw err;
                }
            );
    });
    expressApp.listen(port, () =>
        console.log(`Blindtest listening on port ${port}!`)
    );

    /*  db.collection("blindtest")
    .find()
    .toArray(function(err, result) {
      if (err) throw err;

      console.log(result);
    }); */
});
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

    win.loadURL(environment.windowUrl);

    //// uncomment below to open the DevTools.
    // win.webContents.openDevTools()

    // Event when the window is closed.
    win.on('closed', function() {
        win = null;
    });
}

// Create window on electron intialization
app.on('ready', () => {
    console.log('ready to rumble !');
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
