import { Track } from './../models/track.model';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TrackService {
    public constructor(
        private http: HttpClient,
        private cfgService: ConfigService
    ) {}

    public get(id: string, withData = false): Observable<Track> {
        const params = new HttpParams();
        params.set('id', id);
        if (withData) {
            params.set('withData', 'true');
        }
        return this.http.get<Track>(`${this.cfgService.paths.api}/tracks`, {
            params: params,
        });
    }

    public update(track: Track): Observable<Track> {
        return this.http.put<Track>(
            `${this.cfgService.paths.api}/blindtests/${track._id}`,
            track
        );
    }

    public add(blindtest: Track): Observable<Track> {
        return this.http.post<Track>(
            `${this.cfgService.paths.api}/blindtests`,
            blindtest
        );
    }
}
