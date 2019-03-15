import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Track } from './../models/track.model';
import { ApiService } from './api.service';

export class TrackService extends ApiService<Track> {
    constructor(http: HttpClient, cfgService: ConfigService) {
        super(http, cfgService, 'tracks');
    }
}
