import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    public get paths() {
        return { api: 'api' };
    }

    constructor() {}
}
