import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Track } from './../models/track.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Howl } from 'howler';
import { NouiFormatter } from 'ng2-nouislider';
import * as moment from 'moment';

@Component({
    selector: 'app-edit-track',
    templateUrl: './edit-track.component.html',
    styleUrls: ['./edit-track.component.css'],
})
export class EditTrackComponent implements OnInit {
    public trackForm: FormGroup;

    private dataURI: any;
    private idHowl: number;
    private howler: Howl;
    private _previewDuration = 0;
    public get previewDuration() {
        return this._previewDuration;
    }
    public set previewDuration(duration: number) {
        this._previewDuration = Math.round(duration);
        this.trackForm.setControl(
            'durationRange',
            this.fb.control([0, Math.round(duration)], Validators.required)
        );
    }
    public get track() {
        return this.data.track;
    }
    private _playing = false;
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
            this.howler.fade(1, 0, 2000, this.idHowl);
            this.howler.pause('preview');
        }
    }
    public file: File = null;
    public fileLoaded = false;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        private data: { track: Track; isGloubi: boolean },
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.trackForm = this.fb.group({
            title: this.fb.control(this.track.title, Validators.required),
            durationRange: this.fb.control(
                this.track.durationRange ? this.track.durationRange : [0, 100],
                Validators.required
            ),
        });
        if (!this.data.isGloubi) {
            this.trackForm.addControl(
                'artists',
                this.fb.control(
                    this.track.artists.join(','),
                    Validators.required
                )
            );
        }
    }

    public onFileUploadClicked() {
        document.getElementById('fileInput').click();
        this.fileLoaded = false;
    }

    public onFileUploaded(event) {
        const files: FileList = event.srcElement.files;
        if (files.item(0)) {
            this.file = files.item(0);
            const reader = new FileReader();
            reader.addEventListener(
                'load',
                () => {
                    this.dataURI = reader.result;
                    this.computeSound();
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
        this.howler = new Howl({
            src: [this.dataURI],
            onload: () => {
                this.previewDuration = this.howler.duration();
                this.fileLoaded = true;
            },
        });
        this.trackForm.setControl(
            'durationRange',
            this.fb.control([0, this.howler.duration()], Validators.required)
        );
    }

    private generatePreview() {
        this.howler = new Howl({
            src: [this.dataURI],
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
    public formatter(): NouiFormatter {
        return {
            from: (string: string): number => {
                return (
                    (string.indexOf('m') > -1
                        ? parseInt(string.slice(0, string.indexOf('m')), 10) *
                          60
                        : 0) +
                    parseInt(
                        string.slice(
                            string.indexOf('m') + 1,
                            string.length - 1
                        ),
                        10
                    )
                );
            },
            to: (number: number): string => {
                const myDuration = moment.duration(number, 'second');
                if (myDuration.minutes() >= 1) {
                    return `${myDuration.minutes()}m ${myDuration.seconds()}s`;
                } else {
                    return `${myDuration.seconds()}s`;
                }
            },
        };
    }
}
