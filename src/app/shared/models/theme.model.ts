import { Track } from './track.model';

export class Theme {
    public constructor(
        public tracks?: Track[],
        public name?: string,
        public id?: number,
        public order?: number
    ) {}
}
