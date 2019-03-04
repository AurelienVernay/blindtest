import { ITheme } from 'src/interfaces/theme.interface';

import { ITrack } from 'src/interfaces/track.model';

export class Gloubi implements ITheme {
    public constructor(
        public tracks: ITrack[] = [],
        public name?: string,
        public orderRank?: number
    ) {}
}
