import { Track } from './track.model';

export interface EditTrackOption {
    mode: 'add' | 'edit';
    track?: Track;
    isGloubi: boolean;
    trackOrder?: number;
}
