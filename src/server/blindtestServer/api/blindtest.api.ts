import { Model } from 'mongoose';

import { IBlindtestModel } from './../schemas/blindtest';
import { ApiModelFactory } from './model/api.model';

export class BlindtestApiFactory extends ApiModelFactory<IBlindtestModel> {
    static collectionName = 'blindtest';
    public static generateApiRouter(model: Model<any>) {
        return super.generateApiRouter(model);
    }
}
