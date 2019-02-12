module.exports = {
    bootstrapBackend: callback => {
        const MongoClient = require('mongodb').MongoClient;
        const mongoDb = require('mongodb');
        const bodyParser = require('body-parser');
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
                expressApp.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
                expressApp.use(express.static(__dirname + '/dist/blindtest'));

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
                    console.log(
                        'getting blindtest id ',
                        req.params.blindtestId
                    );
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
                    dbClient.collection('blindtest').replaceOne(
                        { _id: oId },
                        {
                            title: req.body.title,
                            author: req.body.author,
                            themes: req.body.themes,
                        },
                        () =>
                            dbClient
                                .collection('blindtest')
                                .findOne({ _id: oId })
                                .then(
                                    result => {
                                        res.send(result);
                                    },
                                    err => {
                                        throw err;
                                    }
                                )

                    );
                });

                expressApp.delete(
                    '/api/blindtests/:blindtestId',
                    (req, res) => {
                        const oId = new mongoDb.ObjectID(
                            req.params.blindtestId
                        );
                        MongoClient.collection('blindtest').delete({
                            _id: oId,
                        });
                        res.sendStatus(200);
                    }
                );
                expressApp.get('/api/track-datas/:trackId', (req, res) => {
                    const oId = new mongoDb.ObjectID(req.params.trackId);
                    dbClient
                        .collection('track-data')
                        .findOne({
                            _id: oId,
                        })
                        .then(
                            result => res.send(result),
                            err => {
                                throw err;
                            }
                        );
                });
                expressApp.post('/api/track-datas', (req, res) => {
                    dbClient
                        .collection('track-data')
                        .insertOne(req.body, (err, result) => {
                            if (err) throw err;
                            res.send(result.insertedId);
                        });
                    req.body;
                });

                expressApp.get('/api/track-datas/:trackDataId', (req, res) => {
                    const oId = new mongoDb.ObjectID(req.params.trackDataId);
                    dbClient
                        .collection('track-data')
                        .findOne({ _id: oId })
                        .then(
                            result => res.send(result),
                            err => {
                                throw err;
                            }
                        );
                });
                expressApp.get('/*', function(req, res) {
                    res.sendFile(__dirname + '/dist/blindtest/index.html');
                });
                expressApp.listen(port, () => {
                    console.log(`Blindtest listening on port ${port}...`);
                    if (callback) {
                        console.log('calling callback now...');
                        callback();
                    }
                });
            });
        } catch (e) {
            console.error(e);
            exit(-1);
        }
    },
};
