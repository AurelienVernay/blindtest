import { Track } from './track.model';

export class Theme {
    public constructor(
        public name: string,
        public tracks: Track[],
        public id?: number,
        public order?: number
    ) {}
}
