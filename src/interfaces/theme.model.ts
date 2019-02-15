import { Track } from './track.model';

export class Theme {
    public constructor(
        public tracks?: Track[],
        public name?: string,
        public orderRank?: number
    ) {}
}
