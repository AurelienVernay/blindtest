export class Track {
    id: number;
    order?: number;
    artists?: string[];
    title: string;
    durationRange?: number[];
    dataURI?: string;
    playOrder?: number;

    public static isValid(track: Track): boolean {
        return (
            track.dataURI &&
            track.durationRange &&
            track.durationRange.length === 2
        );
    }
}
