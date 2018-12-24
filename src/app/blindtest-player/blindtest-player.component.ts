import { Track } from './../models/track.model';
import { Blindtest } from './../models/blindtest.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BlindtestService } from './../services/blindtest.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable, Subscription, of } from 'rxjs';
import { Howl } from 'howler';

@Component({
    selector: 'app-blindtest-player',
    templateUrl: './blindtest-player.component.html',
    styleUrls: ['./blindtest-player.component.css'],
})
export class BlindtestPlayerComponent implements OnInit, OnDestroy {
    private _$blindtest: Observable<Blindtest>;
    private subscription: Subscription;
    private _playing = false;
    private idPlaying: number;
    private fadeIn = true;
    get playing() {
        return this._playing;
    }
    set playing(val: boolean) {
        console.log(val ? 'playing ' : 'pausing ', this.trackSelected);
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
    private _trackSelected = 1;

    get trackSelected() {
        return this._trackSelected;
    }

    set trackSelected(idx: number) {
        if (this.howl && this.idPlaying) {
            this.howl.stop(this.idPlaying);
        }
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
                onload: () => {
                    console.log('audio loaded ! ', this.trackSelected);
                    if (this.playing) {
                        console.log('playing', this.trackSelected);
                        this.idPlaying = this.howl.play('preview');
                    }
                },
                onend: () => {
                    console.log('audio ended');
                    if (this.trackSelected === this.tracklist.length) {
                        this.playing = false;
                        this.idPlaying = null;
                        this.trackSelected = 1;
                        console.log('blindtest ended ! ');
                    } else {
                        console.log('go to next');
                        this.trackSelected++;
                    }
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
            // affect to set first time sound
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

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        Howler.unload();
    }

    togglePlay() {
        this.playing = !this.playing;
    }

    goToPrevious() {
        console.log('go to previous');
        this.trackSelected--;
        this.fadeIn = true;
        this.playing = true;
    }
    goToNext() {
        console.log('go to next');
        this.trackSelected++;
        this.fadeIn = true;
        this.playing = true;
    }

    get progress(): Observable<number> {
        return of(
            this.howl && this.howl.state() === 'loaded'
                ? (+this.howl.seek() / this.howl.duration(this.idPlaying)) * 100
                : 0
        );
    }
}
