import * as express from 'express';
import * as mongoose from 'mongoose';
import { Subject } from 'rxjs';

import { ApiWrapper } from './api/api-wrapper';
import { BlindtestSchema, IBlindtestModel } from './schemas/blindtest';
import { IModel } from './schemas/model';
import { ITrackDataModel, TrackDataSchema } from './schemas/track-data';

export class BlindtestServer {
    private static instance: BlindtestServer;
    private model: IModel;
    private app: express.Application;
    private connection: mongoose.Connection;
    private constructor(
        private port: number = 9999,
        private callback?: Function
    ) {
        this.model = Object();
        this.app = express();
        const MONGODB_URLCONNECTION = 'mongodb://localhost:27017/blindtest';
        this.connection = mongoose.createConnection(MONGODB_URLCONNECTION, {
            useNewUrlParser: true,
        });
        console.log('test');
        this.model.blindtest = this.connection.model<IBlindtestModel>(
            'Blindtest',
            BlindtestSchema
        );
        this.model.trackData = this.connection.model<ITrackDataModel>(
            'Track-data',
            TrackDataSchema
        );
        this.connection.on(
            'error',
            console.error.bind(console, 'connection error:')
        );
        this.connection.once('open', () => {
            this.api();
            this.config();
            this.ready.next(true);
        });
    }
    public static bootstrap(): BlindtestServer {
        if (!this.instance) {
            this.instance = new BlindtestServer();
            return this.instance;
        } else {
            throw new Error(
                'An instance of BlindtestServer has already been bootstrapped'
            );
        }
    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    private api() {
        this.app.use('/api', ApiWrapper.getApi(this.model));
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    private config() {
        this.app.use(express.static(process.cwd() + '/dist/blindtest'));
        this.app.get('/*', (req, res) => {
            res.sendFile(process.cwd() + '/dist/blindtest/index.html');
        });
        this.app.listen(this.port, () => {
            console.log(`Blindtest listening on port ${this.port}...`);
            if (this.callback) {
                console.log('calling callback now...');
                this.callback();
            }
        });
    }

    public ready = new Subject<boolean>();
    public close() {
        console.log('closing server gracefully...');
        if (this.connection) {
            this.connection.close();
        }
        process.exit(0);
    }
}
