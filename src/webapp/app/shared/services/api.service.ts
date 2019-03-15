import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export abstract class ApiService<T extends { _id: string }> {
    public constructor(
        protected http: HttpClient,
        protected cfgService: ConfigService,
        protected endpoint: string
    ) {}
    public getAll(): Observable<T[]> {
        return this.http.get<T[]>(
            `${this.cfgService.paths.api}/${this.endpoint}`
        );
    }

    public get(id: string): Observable<T> {
        return this.http.get<T>(
            `${this.cfgService.paths.api}/${this.endpoint}/${id}`
        );
    }

    public update(object: T): Observable<T> {
        return this.http.put<T>(
            `${this.cfgService.paths.api}/${this.endpoint}/${object._id}`,
            object
        );
    }

    public add(object: T): Observable<T> {
        return this.http.post<T>(
            `${this.cfgService.paths.api}/${this.endpoint}`,
            object
        );
    }

    public delete(object: T): Observable<any> {
        return this.http.delete(
            `${this.cfgService.paths.api}/${this.endpoint}/${object._id}`
        );
    }
}
