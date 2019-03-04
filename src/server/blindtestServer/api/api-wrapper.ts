import * as express from 'express';

import { BlindtestApiFactory } from './blindtest.api';
import { TrackDataApiFactory } from './track-data.api';
import * as bodyParser from 'body-parser';
import { IModel } from '../schemas/model';

export class ApiWrapper {
    static getApi(model: IModel) {
        console.log('generating API Wrapper');
        const router = express.Router();
        // logger
        router.use((req, res, next) => {
            const now = new Date();
            console.log(now.toString(), ' - accessing ', req.method, req.path);
            next();
        });
        //registering bodyParser
        router.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
        router.use(
            '/blindtests',
            BlindtestApiFactory.generateApiRouter(model.blindtest)
        );
        router.use(
            '/track-datas',
            TrackDataApiFactory.generateApiRouter(model.trackData)
        );
        return router;
    }
}
