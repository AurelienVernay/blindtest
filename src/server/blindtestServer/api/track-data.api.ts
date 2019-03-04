import { Model } from 'mongoose';
import { ITrackDataModel } from './../schemas/track-data';
import { ApiModelFactory } from './model/api.model';

export class TrackDataApiFactory extends ApiModelFactory<ITrackDataModel> {
    static collectionName = 'track-data';
    public static generateApiRouter(model: Model<ITrackDataModel>) {
        return super.generateApiRouter(model);
    }
}
