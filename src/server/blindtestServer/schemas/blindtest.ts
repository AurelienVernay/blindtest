import { Document, Schema, Model, model } from 'mongoose';
import { IBlindtest } from '../../../interfaces/blindtest.interface';

export interface IBlindtestModel extends IBlindtest, Document {
    // expected methods
}

export const BlindtestSchema: Schema = new Schema({
    title: String,
    author: String,
    themes: {
        type: Map,
        of: {
            name: String,
            tracks: [
                {
                    artists: [String],
                    title: String,
                    offset: Number,
                    duration: Number,
                    data_id: Schema.Types.ObjectId,
                },
            ],
        },
    },
    gloubi: {
        type: new Schema(
            {
                name: String,
                tracks: [],
            },
            {}
        ),
        required: false,
    },
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

export const Blindtest: Model<IBlindtestModel> = model<IBlindtestModel>(
    'Blindtest',
    BlindtestSchema
);
