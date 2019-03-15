import { TrackData } from './../models/track-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ITrackData } from '../../../../interfaces/track-data.interface';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class TrackDataService {
    public constructor(
        private http: HttpClient,
        private cfgService: ConfigService
    ) {}

    public get(id: string): Observable<TrackData> {
        return this.http.get<TrackData>(
            `${this.cfgService.paths.api}/track-datas/${id}`
        );
    }

    public update(trackData: TrackData): Observable<TrackData> {
        return this.http.put<TrackData>(
            `${this.cfgService.paths.api}/track-datas/${trackData._id}`,
            trackData
        );
    }

    public add(trackData: TrackData): Observable<TrackData> {
        return this.http.post<TrackData>(
            `${this.cfgService.paths.api}/track-datas`,
            trackData
        );
    }
}
