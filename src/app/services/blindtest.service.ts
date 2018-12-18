import { Theme } from './../models/theme.model';
import { Blindtest } from './../models/blindtest.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BlindtestService {
    public constructor(private http: HttpClient) {}

    public getAll(): Observable<Blindtest[]> {
        return this.http.get<any[]>('http://localhost:3000/blindtests');
    }

    public get(id: number): Observable<Blindtest> {
        return this.http.get<Blindtest>(
            `http://localhost:3000/blindtests/${id}`
        );
    }

    public update(blindtest: Blindtest): Observable<Blindtest> {
        return this.http.put<Blindtest>(
            `http://localhost:3000/blindtests/${blindtest.id}`,
            blindtest
        );
    }

    public add(blindtest: Blindtest): Observable<Blindtest> {
        return this.http.post<Blindtest>(
            `http://localhost:3000/blindtests`,
            blindtest
        );
    }
}