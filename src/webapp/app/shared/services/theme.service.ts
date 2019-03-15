import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Theme } from './../models/theme.model';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class ThemeService extends ApiService<Theme> {
    constructor(http: HttpClient, cfgService: ConfigService) {
        super(http, cfgService, 'themes');
    }
}
