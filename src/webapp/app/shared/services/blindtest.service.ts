import { Theme } from './../models/theme.model';
import { ConfigService } from './config.service';
import { Blindtest } from '../../shared/models/blindtest.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class BlindtestService extends ApiService<Blindtest> {
    public constructor(http: HttpClient, cfgService: ConfigService) {
        super(http, cfgService, 'blindtests');
    }
    public getThemes(blindtest: Blindtest): Observable<Theme[]> {
        return this.http.get<Theme[]>(
            `${this.cfgService.paths.api}/blindtests/${blindtest._id}/themes`
        );
    }

    public getTheme(blindtest: Blindtest, order: number): Observable<Theme> {
        return this.http.get<Theme>(
            `${this.cfgService.paths.api}/blindtests/${
                blindtest._id
            }/themes/${order}`
        );
    }

    public updateBlindtestTheme(
        blindtest: Blindtest,
        order: number,
        theme: Theme
    ): Observable<Theme> {
        return this.http.put<Theme>(
            `${this.cfgService.paths.api}/blindtests/${
                blindtest._id
            }/themes/${order}`,
            theme
        );
    }
    public deleteBlindtestTheme(
        blindtest: Blindtest,
        order: number
    ): Observable<any> {
        return this.http.delete<any>(
            `${this.cfgService.paths.api}/blindtests/${
                blindtest._id
            }/themes/${order}`
        );
    }
}
