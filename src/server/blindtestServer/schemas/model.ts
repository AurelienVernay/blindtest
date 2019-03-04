import { ITrackDataModel } from './track-data';
import { Model } from 'mongoose';
import { IBlindtestModel } from './blindtest';

export interface IModel {
    blindtest: Model<IBlindtestModel>;
    trackData: Model<ITrackDataModel>;
}
