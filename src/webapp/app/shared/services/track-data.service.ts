import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrackData } from '../../../../interfaces/track-data.model';

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

    public update(trackData: TrackData): Observable<string> {
        return this.http.put<string>(
            `${this.cfgService.paths.api}/track-datas/${trackData._id}`,
            trackData
        );
    }

    public add(trackData: TrackData): Observable<string> {
        return this.http.post<string>(
            `${this.cfgService.paths.api}/track-datas`,
            trackData
        );
    }
}
