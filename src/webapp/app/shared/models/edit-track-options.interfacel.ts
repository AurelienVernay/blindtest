import { ITrack } from 'src/interfaces/track.model';

export interface EditTrackOption {
    mode: 'add' | 'edit';
    track?: ITrack;
    isGloubi: boolean;
    trackOrder?: number;
}
