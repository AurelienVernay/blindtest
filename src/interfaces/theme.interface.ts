import { ITrack } from './track.model';

export interface ITheme {
    tracks: ITrack[];
    name?: string;
    orderRank?: number;
}
