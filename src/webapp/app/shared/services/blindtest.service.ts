import { ConfigService } from './config.service';
import { Blindtest } from '../../../../interfaces/blindtest.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BlindtestService {
    public constructor(
        private http: HttpClient,
        private cfgService: ConfigService
    ) {}

    public getAll(): Observable<Blindtest[]> {
        return this.http.get<Blindtest[]>(
            `${this.cfgService.paths.api}/blindtests`
        );
    }

    public get(id: string): Observable<Blindtest> {
        return this.http.get<Blindtest>(
            `${this.cfgService.paths.api}/blindtests/${id}`
        );
    }

    public update(blindtest: Blindtest): Observable<Blindtest> {
        return this.http.put<Blindtest>(
            `${this.cfgService.paths.api}/blindtests/${blindtest._id}`,
            blindtest
        );
    }

    public add(blindtest: Blindtest): Observable<Blindtest> {
        return this.http.post<Blindtest>(
            `${this.cfgService.paths.api}/blindtests`,
            blindtest
        );
    }
}
