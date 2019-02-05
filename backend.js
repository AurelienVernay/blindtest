//Init MongoDB Client, boot up app after
const MongoClient = require('mongodb').MongoClient;
const mongoDb = require('mongodb');
const bodyParser = require('body-parser');
let dbClient, expressApp;
try {
    MongoClient.connect('mongodb://localhost:27017/blindtest', function(
        err,
        client
    ) {
        if (err) throw err;

        dbClient = client.db('blindtest');
        // Express part - serve local endpoints
        const express = require('express');
        expressApp = express();
        const port = 9999;
        expressApp.use(bodyParser.json()); // for parsing application/json
        expressApp.get('/api/blindtests', (req, res) => {
            console.log('getting all blindtests');
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
        expressApp.get('/api/blindtests/:blindtestId', (req, res) => {
            console.log('getting blindtest id ', req.params.blindtestId);
            const oId = new mongoDb.ObjectID(req.params.blindtestId);
            dbClient
                .collection('blindtest')
                .findOne({ _id: oId })
                .then(
                    result => res.send(result),
                    err => {
                        throw err;
                    }
                );
        });

        expressApp.put('/api/blindtests/:blindtestId', (req, res) => {
            console.log(
                'updating blindtest id ',
                req.params.blindtestId,
                'with body ',
                req.body
            );
            const oId = new mongoDb.ObjectID(req.params.blindtestId);
            dbClient
                .collection('blindtest')
                .findOneAndReplace(
                    { _id: oId },
                    {
                        title: req.body.title,
                        author: req.body.author,
                        themes: req.body.themes,
                    }
                )
                .then(
                    result => res.send(result),
                    err => {
                        throw err;
                    }
                );
        });

        expressApp.use(express.static(__dirname + '/dist/blindtest'));

        expressApp.listen(port, () =>
            console.log(`Blindtest listening on port ${port}...`)
        );
    });
} catch (e) {
    exit(-1);
}
