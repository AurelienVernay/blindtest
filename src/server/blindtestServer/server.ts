import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import { Subject } from 'rxjs';

export class BlindtestServer {
    public app: express.Application;
    private connection: mongoose.Connection;
    public ready = new Subject<boolean>();
    constructor(private port: number = 9999, private callback?: Function) {
        this.app = express();
        this.config();
        this.api();
    }
    public static bootstrap(): BlindtestServer {
        return new BlindtestServer();
    }
    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        this.app.get('/api/blindtests', (req, res) => {
            console.log('getting all blindtests');
            this.connection
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
        this.app.get('/api/blindtests/:blindtestId', (req, res) => {
            console.log('getting blindtest id ', req.params.blindtestId);
            const oId = new ObjectID(req.params.blindtestId);
            this.connection
                .collection('blindtest')
                .findOne({ _id: oId })
                .then(
                    result => res.send(result),
                    err => {
                        throw err;
                    }
                );
        });

        this.app.put('/api/blindtests/:blindtestId', (req, res) => {
            const oId = new ObjectID(req.params.blindtestId);
            this.connection
                .collection('blindtest')
                .findOne({ _id: oId }, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    result.themes.forEach(existingTheme => {
                        const idx = req.body.themes.findIndex(
                            theme => theme.orderRank === existingTheme.orderRank
                        );
                        // case of deleting a theme
                        if (idx === -1) {
                            existingTheme.tracks.forEach(track =>
                                this.connection
                                    .collection('track-data')
                                    .deleteOne({ _id: track.data_id })
                            );
                        } else {
                            // check if a track has been deleted
                            const newTracks = req.body.themes[idx].tracks;
                            existingTheme.tracks.forEach(track => {
                                const trackIdx = newTracks.findIndex(
                                    newTrack =>
                                        newTrack.orderRank === track.orderRank
                                );
                                if (trackIdx === -1) {
                                    const trackOId = new ObjectID(
                                        track.data_id
                                    );
                                    this.connection
                                        .collection('track-data')
                                        .deleteOne(
                                            { _id: trackOId },
                                            (err, result) => {
                                                if (err) {
                                                    throw err;
                                                }
                                                console.log(result);
                                            }
                                        );
                                }
                            });
                        }
                    });
                });
            //reorder tracks
            req.body.themes.forEach(theme =>
                theme.tracks.forEach((track, i) => (track.orderRank = i + 1))
            );
            console.log(req.body.themes);
            // replace blindtest with new datas
            this.connection
                .collection('blindtest')
                .replaceOne({ _id: oId }, req.body, () =>
                    this.connection
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

        this.app.delete('/api/blindtests/:blindtestId', (req, res) => {
            const oId = new ObjectID(req.params.blindtestId);
            this.connection.collection('blindtest').deleteOne({
                _id: oId,
            });
            res.sendStatus(200);
        });
        this.app.get('/api/track-datas/:trackId', (req, res) => {
            const oId = new ObjectID(req.params.trackId);
            this.connection
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
        this.app.post('/api/track-datas', (req, res) => {
            this.connection
                .collection('track-data')
                .insertOne(req.body, (err, result) => {
                    if (err) throw err;
                    res.send(result.insertedId);
                });
        });
        this.app.put('/api/track-datas/:trackId', (req, res) => {
            const oId = new ObjectID(req.params.trackId);
            this.connection
                .collection('track-data')
                .replaceOne(
                    {
                        _id: oId,
                    },
                    { base64: req.body.base64 }
                )
                .then(
                    result => res.send(oId),
                    err => {
                        throw err;
                    }
                );
        });
        this.app.get('/api/track-datas/:trackDataId', (req, res) => {
            const oId = new ObjectID(req.params.trackDataId);
            this.connection
                .collection('track-data')
                .findOne({ _id: oId })
                .then(
                    result => res.send(result),
                    err => {
                        throw err;
                    }
                );
        });
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        const MONGODB_URLCONNECTION = 'mongodb://localhost:27017/blindtest';
        this.app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
        this.app.use(express.static(__dirname + '/dist/blindtest'));
        this.connection = mongoose.createConnection(MONGODB_URLCONNECTION);
        this.app.get('/*', function(req, res) {
            res.sendFile(__dirname + '/dist/blindtest/index.html');
        });
        this.app.listen(this.port, () => {
            console.log(`Blindtest listening on this.port ${this.port}...`);
            if (this.callback) {
                this.callback();
            }
        });
    }

    public close() {
        console.log('closing server gracefully...');
        if (this.connection) {
            this.connection.close();
        }
        process.exit(0);
    }
}
