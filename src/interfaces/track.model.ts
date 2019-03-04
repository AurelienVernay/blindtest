export interface ITrack {
    _id: string;
    orderRank?: number;
    artists?: string[];
    title: string;
    playOrder?: number;
    offset: number;
    duration: number;
    data_id: string;
}
