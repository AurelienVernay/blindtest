import { ITrack } from 'src/interfaces/track.model';

export class Track implements ITrack {
    public _id: string;
    public orderRank?: number;
    public artists?: string[];
    public title: string;
    public playOrder?: number;
    public offset: number;
    public duration: number;
    public data_id: string;
}
