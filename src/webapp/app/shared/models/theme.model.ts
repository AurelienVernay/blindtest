import { ITrack } from './../../../../interfaces/track.model';
import { ITheme } from 'src/interfaces/theme.interface';

export class Theme implements ITheme {
    constructor(
        public _id: string,
        public tracks: ITrack[],
        public name: string,
        public orderRank?: number
    ) {}
}
