import { ConfigService } from './config.service';
import { IBlindtest } from '../../../../interfaces/blindtest.interface';
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

    public getAll(): Observable<IBlindtest[]> {
        return this.http.get<IBlindtest[]>(
            `${this.cfgService.paths.api}/blindtests`
        );
    }

    public get(id: string): Observable<IBlindtest> {
        return this.http.get<IBlindtest>(
            `${this.cfgService.paths.api}/blindtests/${id}`
        );
    }

    public update(blindtest: IBlindtest): Observable<IBlindtest> {
        return this.http.put<IBlindtest>(
            `${this.cfgService.paths.api}/blindtests/${blindtest._id}`,
            blindtest
        );
    }

    public add(blindtest: IBlindtest): Observable<IBlindtest> {
        return this.http.post<IBlindtest>(
            `${this.cfgService.paths.api}/blindtests`,
            blindtest
        );
    }
}
