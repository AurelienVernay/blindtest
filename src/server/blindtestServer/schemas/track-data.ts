import { Document, Schema, Model, model } from 'mongoose';
import { ITrackData } from '../../../interfaces/track-data.interface';

export interface ITrackDataModel extends ITrackData, Document {
    // expected methods
}

export const TrackDataSchema: Schema = new Schema({
    base64: String,
});
/**

BlindtestSchema.pre<IBlindtestModel>('save', function(next) {
    let now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

BlindtestSchema.methods.fullName = function(): string {
    return this.firstName.trim() + ' ' + this.lastName.trim();
};
*/

export const TrackData: Model<ITrackDataModel> = model<ITrackDataModel>(
    'Track-data',
    TrackDataSchema
);
