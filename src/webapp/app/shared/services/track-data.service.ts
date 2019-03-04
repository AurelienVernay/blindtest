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

    public get(id: string): Observable<ITrackData> {
        return this.http.get<ITrackData>(
            `${this.cfgService.paths.api}/track-datas/${id}`
        );
    }

    public update(trackData: ITrackData): Observable<string> {
        return this.http.put<string>(
            `${this.cfgService.paths.api}/track-datas/${trackData._id}`,
            trackData
        );
    }

    public add(trackData: ITrackData): Observable<string> {
        return this.http.post<string>(
            `${this.cfgService.paths.api}/track-datas`,
            trackData
        );
    }
}
