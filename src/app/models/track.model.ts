export interface Track {
    id: number;
    order?: number;
    artists?: string[];
    title: string;
    durationRange?: number[];
    dataURI?: string;
}
