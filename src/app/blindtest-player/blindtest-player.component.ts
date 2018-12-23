import { Track } from './../models/track.model';
import { Blindtest } from './../models/blindtest.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BlindtestService } from './../services/blindtest.service';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Howl } from 'howler';

@Component({
    selector: 'app-blindtest-player',
    templateUrl: './blindtest-player.component.html',
    styleUrls: ['./blindtest-player.component.css'],
})
export class BlindtestPlayerComponent implements OnInit {
    private _$blindtest: Observable<Blindtest>;
    private subscription: Subscription;
    private _playing = false;
    private idPlaying: number;
    private fadeIn = true;
    get playing() {
        return this._playing;
    }
    set playing(val: boolean) {
        this._playing = val;
        if (val) {
            if (this.fadeIn) {
                this.howl.fade(0, 1, 2000);
            }
            this.idPlaying = this.howl.play(this.idPlaying || 'preview');
            this.fadeIn = false;
        } else {
            this.howl.pause(this.idPlaying);
        }
    }

    private howl: Howl;
    private _tracklist: Track[] = [];
    set tracklist(tracks: Track[]) {
        this._tracklist = tracks;
    }
    get tracklist() {
        return this._tracklist.sort((a, b) => a.playOrder - b.playOrder);
    }
    private _trackSelected: number;

    get trackSelected() {
        return this._trackSelected;
    }

    set trackSelected(idx: number) {
        this._trackSelected = idx;
        if (this.tracklist) {
            const track = this.tracklist[this.trackSelected - 1];
            this.howl = new Howl({
                src: track.dataURI,
                sprite: {
                    preview: [
                        track.durationRange[0] * 1000,
                        (track.durationRange[1] - track.durationRange[0]) *
                            1000,
                    ],
                },
                onloaderror: (id, error) => console.error(id, error),
                onplayerror: (id, error) => console.error(id, error),
            });
        }
    }
    public columnsToDisplay = ['playOrder'];
    public get $blindtest() {
        return this._$blindtest;
    }
    public set $blindtest(observable: Observable<Blindtest>) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this._$blindtest = observable;
        this.subscription = this._$blindtest.subscribe(blindtest => {
            this.loading = true;
            this.tracklist = [];
            let count = 1;
            this.blindtest = blindtest;
            blindtest.themes.forEach(theme => {
                theme.tracks.forEach(track => {
                    track.playOrder = count;
                    count++;
                });
                this.tracklist.push(...theme.tracks);
            });
            if (blindtest.gloubi) {
                blindtest.gloubi.tracks.forEach(track => {
                    track.playOrder = count;
                    count++;
                });
                this.tracklist.push(...blindtest.gloubi.tracks);
            }
            this.trackSelected = 1;
            this.loading = false;
        });
    }
    public blindtest: Blindtest;
    public loading = true;

    constructor(
        private route: ActivatedRoute,
        public btService: BlindtestService
    ) {}

    ngOnInit() {
        this.$blindtest = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.btService.get(+params.get('id'))
            )
        );
    }

    togglePlay() {
        this.playing = !this.playing;
    }

    goToPrevious() {
        this.trackSelected--;
        this.fadeIn = true;
        this.playing = true;
    }
    goToNext() {
        this.trackSelected++;
        this.fadeIn = true;
        this.playing = true;
    }
}
