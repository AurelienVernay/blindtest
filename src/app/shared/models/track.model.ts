import { TrackData } from './track-data.model';

export class Track {
    _id: string;
    order?: number;
    artists?: string[];
    title: string;
    playOrder?: number;
    data?: TrackData;
}
