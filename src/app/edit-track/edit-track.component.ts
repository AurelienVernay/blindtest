import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Track } from './../models/track.model';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Howl } from 'howler';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-edit-track',
    templateUrl: './edit-track.component.html',
    styleUrls: ['./edit-track.component.css'],
})
export class EditTrackComponent implements OnInit, OnDestroy {
    public trackForm: FormGroup;
    private idHowl: number;
    private howler: Howl;
    private _previewDuration = 0;
    private formatter = {
        from: (string: string): number => {
            return (
                (string.indexOf('m') > -1
                    ? parseInt(string.slice(0, string.indexOf('m')), 10) * 60
                    : 0) +
                parseInt(
                    string.slice(string.indexOf('m') + 1, string.length - 1),
                    10
                )
            );
        },
        to: (number: number): string => {
            const myDuration = moment.duration(number, 'second');
            if (myDuration.minutes() >= 1) {
                let value = `${myDuration.minutes()}m`;
                if (myDuration.seconds() > 0) {
                    value = value.concat(` ${myDuration.seconds()}s`);
                }
                return value;
            } else {
                return `${myDuration.seconds()}s`;
            }
        },
    };
    private durationSubscription: Subscription;
    private dataURISubscription: Subscription;
    private _playing = false;
    public formatters = [this.formatter, this.formatter];

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    public get previewDuration() {
        return this._previewDuration;
    }
    public set previewDuration(duration: number) {
        this._previewDuration = Math.round(duration);
    }
    public durationSelected = 0;
    public get track() {
        return this.data.track;
    }

    get playing() {
        return this._playing;
    }
    set playing(play: boolean) {
        this._playing = play;
        if (play) {
            this.generatePreview();
            this.trackForm.controls['durationRange'].disable();
            this.idHowl = this.howler.play('preview');
            this.howler.fade(0, 1, 2000, this.idHowl);
        } else {
            this.trackForm.controls['durationRange'].enable();
            this.howler.stop(this.idHowl);
        }
    }
    public file: File = null;
    public loading = false;
    public loaded = false;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { track: Track; isGloubi: boolean },
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.trackForm = this.fb.group({
            title: this.fb.control(this.track.title, Validators.required),
            durationRange: this.fb.control(
                this.track.durationRange,
                Validators.required
            ),
            dataURI: this.fb.control(this.track.dataURI, Validators.required),
            order: this.fb.control(this.track.order),
        });
        if (!this.data.isGloubi) {
            this.trackForm.addControl(
                'artists',
                this.fb.control(this.track.artists, Validators.required)
            );
        }
        this.durationSubscription = this.trackForm.valueChanges.subscribe(
            values => {
                if (values.durationRange) {
                    this.durationSelected =
                        values.durationRange[1] - values.durationRange[0];
                }
            }
        );
        this.dataURISubscription = this.trackForm.controls[
            'dataURI'
        ].valueChanges.subscribe(() => {
            this.loading = true;
            this.computeSound();
        });
        if (this.track.dataURI) {
            this.loading = true;
            this.computeSound();
        }
        if (this.track.durationRange) {
            this.durationSelected =
                this.track.durationRange[1] - this.track.durationRange[0];
        }
    }

    ngOnDestroy(): void {
        if (this.durationSubscription) {
            this.durationSubscription.unsubscribe();
        }
        if (this.dataURISubscription) {
            this.dataURISubscription.unsubscribe();
        }
        if (this.howler) {
            this.howler.unload();
        }
    }

    public onFileUploadClicked() {
        document.getElementById('fileInput').click();
        this.loaded = false;
        this.previewDuration = null;
    }

    public onFileUploaded(event) {
        this.file = event.srcElement.files.item(0);
        if (this.file) {
            if (this.howler) {
                this.howler.unload();
            }
            this.loading = true;
            const reader = new FileReader();
            reader.addEventListener(
                'load',
                () => {
                    this.trackForm.controls['dataURI'].setValue(reader.result);
                },
                false
            );
            reader.readAsDataURL(this.file);
        }
    }
    public togglePlay() {
        this.playing = !this.playing;
    }

    private computeSound() {
        this.loading = true;
        this.howler = new Howl({
            src: [this.trackForm.controls['dataURI'].value],
            onload: () => {
                this.previewDuration = this.howler.duration();
                this.loading = false;
                this.loaded = true;
                if (!this.track.durationRange) {
                    this.trackForm.setControl(
                        'durationRange',
                        this.fb.control(
                            [0, this.howler.duration()],
                            Validators.required
                        )
                    );
                }
            },
        });
    }

    private generatePreview() {
        this.howler = new Howl({
            src: [this.trackForm.controls['dataURI'].value],
            sprite: {
                preview: [
                    this.trackForm.controls['durationRange'].value[0] * 1000,
                    (this.trackForm.controls['durationRange'].value[1] -
                        this.trackForm.controls['durationRange'].value[0]) *
                        1000,
                    false,
                ],
            },
            onend: () => {
                this.playing = false;
            },
        });
    }

    public addNewArtistToTrack(event) {
        if ((event.input.value || '').trim()) {
            this.trackForm.controls['artists'].setValue([
                ...this.trackForm.controls['artists'].value,
                event.input.value,
            ]);
            event.input.value = null;
        }
    }
    public removeArtistFromTrack(artist: string) {
        this.trackForm.controls['artists'].setValue([
            ...this.trackForm.controls['artists'].value.filter(
                find => find !== artist
            ),
        ]);
    }
}
