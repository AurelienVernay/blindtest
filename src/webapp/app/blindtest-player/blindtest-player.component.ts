import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Howl } from 'howler';
import { Observable, Subject, combineLatest } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

import { IBlindtest } from '../../../interfaces/blindtest.interface';
import { ITrack } from '../../../interfaces/track.model';
import { BlindtestService } from './../shared/services/blindtest.service';
import { TrackDataService } from './../shared/services/track-data.service';

@Component({
    selector: 'app-blindtest-player',
    templateUrl: './blindtest-player.component.html',
    styleUrls: ['./blindtest-player.component.css'],
})
export class BlindtestPlayerComponent implements OnInit, OnDestroy {
    private blindtest$: Observable<IBlindtest>;
    public blindtestLoading = true;
    public blindtest: IBlindtest;
    public tracklist: ITrack[] = [];
    private showAnswers = false;
    private playOrderCol = ['playOrder'];
    private answersCol = ['artists', 'title'];
    public columnsToDisplay = this.playOrderCol;
    private _trackSelection: number;
    private howl: Howl;
    private idHowl: number;
    public trackLoading = false;
    public get trackSelection() {
        return this._trackSelection;
    }
    public set trackSelection(value: number) {
        this._trackSelection = value;
        this.trackSubject.next(value);
    }
    public get trackListIndex(): ITrack {
        return this.tracklist[this.trackSelection - 1];
    }
    private _playing = false;
    public get playing() {
        return this._playing;
    }
    public set playing(val: boolean) {
        this._playing = val;
        this.playingSubject.next(val);
    }
    private trackSubject = new Subject<number>();
    public playingSubject = new Subject<boolean>();
    private howlLoadedSubject = new Subject<Howl>();

    constructor(
        private blindtestService: BlindtestService,
        private route: ActivatedRoute,
        private trackDataService: TrackDataService
    ) {}
    ngOnInit() {
        this.blindtest$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.blindtestService.get(params.get('id'))
            )
        );
        this.trackSubject
            .pipe(
                tap(() => (this.trackLoading = true)),
                switchMap((index: number) =>
                    this.trackDataService.get(this.tracklist[index - 1].data_id)
                )
            )
            .subscribe(trackData => {
                this.idHowl = null;
                if (this.howl && this.howl.playing()) {
                    this.howl.stop();
                }
                this.howl = new Howl({
                    src: [trackData.base64],
                    sprite: {
                        extract: [
                            this.trackListIndex.offset * 1000,
                            (this.trackListIndex.offset +
                                this.trackListIndex.duration) *
                                1000,
                        ],
                    },
                    onend: () => {
                        if (this.trackSelection < this.tracklist.length) {
                            this.goToNext();
                        } else {
                            this.stop();
                        }
                    },
                    onload: () => this.howlLoadedSubject.next(this.howl),
                });
            });
        this.howlLoadedSubject.subscribe(() => (this.trackLoading = false));
        combineLatest(this.howlLoadedSubject, this.playingSubject).subscribe(
            ([howl, playing]) => {
                if (playing) {
                    this.idHowl = howl.play(this.idHowl || 'extract');
                } else {
                    howl.pause(this.idHowl);
                }
            }
        );
        this.blindtest$.subscribe(result => {
            this.blindtest = result;
            this.blindtest.themes.forEach(
                theme =>
                    (this.tracklist = [
                        ...this.tracklist,
                        ...theme.tracks
                            .map(elem => ({
                                ...elem,
                                playOrder:
                                    this.tracklist.length + elem.orderRank,
                            }))
                            .sort((a, b) => a.orderRank - b.orderRank),
                    ])
            );
            this.trackSelection = 1;
            this.blindtestLoading = false;
        });
    }
    ngOnDestroy(): void {
        if (this.howl) {
            this.howl.unload();
        }
    }

    togglePlay() {
        this.playing = !this.playing;
    }

    goToPrevious() {
        this.trackSelection--;
    }

    goToNext() {
        this.trackSelection++;
    }
    stop() {
        this.playing = false;
        this.trackSelection = 1;
    }
    toggleAnswers() {
        if (this.showAnswers) {
            this.columnsToDisplay = [...this.playOrderCol];
        } else {
            this.columnsToDisplay = [...this.playOrderCol, ...this.answersCol];
        }
        this.showAnswers = !this.showAnswers;
    }
}
