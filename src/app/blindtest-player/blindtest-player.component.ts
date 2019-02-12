import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Howl } from 'howler';
import { Observable, Subject, Subscription } from 'rxjs';
import { combineLatest, switchMap } from 'rxjs/operators';

import { Blindtest } from '../shared/models/blindtest.model';
import { Track } from '../shared/models/track.model';
import { BlindtestService } from '../shared/services/blindtest.service';

@Component({
    selector: 'app-blindtest-player',
    templateUrl: './blindtest-player.component.html',
    styleUrls: ['./blindtest-player.component.css'],
})
export class BlindtestPlayerComponent implements OnInit, OnDestroy {
    private _$blindtest: Observable<Blindtest>;
    private subscription: Subscription;
    private idPlaying: number;

    private _playing = false;
    get playing() {
        return this._playing;
    }
    set playing(value: boolean) {
        this._playing = value;
        this.playingSubject.next(value);
    }
    public playingSubject = new Subject<boolean>();
    private previousTrackSelection: number;
    private _trackSelection = 1;
    get trackSelection() {
        return this._trackSelection;
    }
    set trackSelection(value: number) {
        this.previousTrackSelection = this._trackSelection;
        this._trackSelection = value;
        this.trackSelectionSubject.next(value);
    }
    public trackSelectionSubject = new Subject<number>();

    private howl: Howl;
    private _tracklist: Track[] = [];
    set tracklist(tracks: Track[]) {
        this._tracklist = tracks;
    }
    get tracklist() {
        return this._tracklist.sort((a, b) => a.playOrder - b.playOrder);
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
        this._$blindtest.subscribe(blindtest => {
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
            this.subscription = this.trackSelectionSubject
                .pipe(combineLatest(this.playingSubject))
                .subscribe(([trackNumber, playing]) => {
                    if (trackNumber === this.previousTrackSelection) {
                        if (!playing && this.howl) {
                            this.howl.pause(this.idPlaying);
                        }
                        if (playing && this.howl) {
                            this.howl.play(this.idPlaying || 'preview');
                        }
                    } else {
                        if (this.howl) {
                            this.howl.unload();
                        }
                        const track = this.tracklist[trackNumber - 1];
                        //TODO track.data.base64
                        this.howl = new Howl({
                            src: null,
                            sprite: {
                                preview: [
                                    track.offset * 1000,
                                    track.duration * 1000,
                                ],
                            },
                            onload: () => {
                                console.log('audio loaded', trackNumber);
                                if (playing) {
                                    console.log('playing', trackNumber);
                                    this.idPlaying = this.howl.play('preview');
                                }
                            },
                            onend: () => {
                                console.log('audio ended');
                                if (trackNumber === this.tracklist.length) {
                                    this.playing = false;
                                    this.idPlaying = null;
                                    this.trackSelection = 1;
                                    console.log('blindtest ended ! ');
                                } else {
                                    console.log('go to next');
                                    this.trackSelection++;
                                }
                            },
                            onloaderror: (id, error) =>
                                console.error(id, error),
                            onplayerror: (id, error) =>
                                console.error(id, error),
                        });
                    }
                });
            // init first song
            this.playing = false;
            this.trackSelectionSubject.next(1);
            this.loading = false;
        });
    }
    public progress: Observable<number> = Observable.create(observer => {});
    public blindtest: Blindtest;
    public loading = true;

    constructor(
        private route: ActivatedRoute,
        public btService: BlindtestService
    ) {}

    ngOnInit() {
        this.$blindtest = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.btService.get(params.get('id'))
            )
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        Howler.unload();
        this.playingSubject.unsubscribe();
        this.trackSelectionSubject.unsubscribe();
    }

    togglePlay() {
        console.log('play / pause');
        this.playing = !this.playing;
    }

    goToPrevious() {
        console.log('go to previous');
        this.trackSelection--;
    }
    goToNext() {
        console.log('go to next');
        this.trackSelection++;
    }
}
