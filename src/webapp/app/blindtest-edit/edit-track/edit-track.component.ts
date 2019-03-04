import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Howl } from 'howler';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { EditTrackOption } from '../../shared/models/edit-track-options.interfacel';
import { TrackDataService } from './../../shared/services/track-data.service';

@Component({
    selector: 'app-edit-track',
    templateUrl: './edit-track.component.html',
    styleUrls: ['./edit-track.component.css'],
})
export class EditTrackComponent implements OnInit, OnDestroy {
    public trackForm: FormGroup;
    public separatorKeysCodes = [ENTER, COMMA];
    public durationSelected = 0;
    public loadingFile = false;
    public loaded = false;
    public _playing = false;
    private howl: Howl;

    public formatters = new Array(2).fill({
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
    });

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: EditTrackOption,
        public dialogRef: MatDialogRef<EditTrackComponent>,
        private fb: FormBuilder,
        private trackDataService: TrackDataService
    ) {
        this.trackForm = this.fb.group({
            order: this.fb.control(null, Validators.required),
            title: this.fb.control(null, Validators.required),
            offset: this.fb.control(null, Validators.required),
            duration: this.fb.control(null, Validators.required),
            audioDuration: this.fb.control(null, Validators.required),
            uiSliderControl: this.fb.control([0, 0]),
            data: this.fb.control(null),
        });
        if (!data.isGloubi) {
            this.trackForm.addControl(
                'artists',
                this.fb.array([], Validators.required)
            );
        }
        // translate formControl for NoUISlider to Howler-compatible formControls
        this.trackForm.get('uiSliderControl').valueChanges.subscribe(value => {
            this.trackForm.get('offset').setValue(value[0]);
            this.trackForm.get('duration').setValue(value[1] - value[0]);
            this.howl = new Howl({
                src: [this.trackForm.get('data').value],
                sprite: {
                    preview: [
                        this.trackForm.get('offset').value * 1000,
                        this.trackForm.get('duration').value * 1000,
                    ],
                },
                onend: () => (this.playing = false),
            });
        });
        this.trackForm.get('data').valueChanges.subscribe(value => {
            if (this.howl) {
                this.howl.unload();
            }
            this.howl = new Howl({
                src: [value],
                onload: () => {
                    this.trackForm
                        .get('audioDuration')
                        .setValue(this.howl.duration());
                    if (this.trackForm.get('duration').value === null) {
                        this.trackForm
                            .get('uiSliderControl')
                            .setValue([0, this.howl.duration()]);
                    }
                    this.loadingFile = false;
                    this.loaded = true;
                },
            });
        });
    }

    ngOnInit() {
        if (this.data.track) {
            this.trackForm.get('order').setValue(this.data.track.orderRank);
            this.trackForm.get('title').setValue(this.data.track.title);
            this.trackForm
                .get('uiSliderControl')
                .setValue([
                    this.data.track.offset,
                    this.data.track.offset + this.data.track.duration,
                ]);
            if (!this.data.isGloubi) {
                const formArray = this.fb.array(
                    this.data.track.artists.map(artist =>
                        this.fb.control(artist)
                    )
                );
                this.trackForm.setControl('artists', formArray);
            }
            this.loadingFile = true;
            // Call TrackDataService to get base64 Data URI
            this.trackDataService
                .get(this.data.track.data_id)
                .subscribe(trackData => {
                    this.trackForm.get('data').setValue(trackData.base64);
                });
        }
        if (this.data.trackOrder) {
            this.trackForm.get('order').setValue(this.data.trackOrder);
        }
    }
    ngOnDestroy() {
        if (this.howl) {
            this.howl.unload();
        }
    }

    addArtist(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;

        // Add artist
        if ((value || '').trim()) {
            const array = this.trackForm.get('artists') as FormArray;
            array.push(this.fb.control(event.value));
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }
    removeArtist(index) {
        const array = this.trackForm.get('artists') as FormArray;
        array.removeAt(index);
    }
    openUploadDialog() {
        document.getElementById('fileInput').click();
    }
    onFileUploaded(event) {
        const file = event.srcElement.files.item(0);
        if (file) {
            this.loadingFile = true;
            const reader = new FileReader();
            reader.addEventListener(
                'load',
                () => {
                    this.trackForm.get('data').setValue(reader.result);
                },
                false
            );
            reader.readAsDataURL(file);
        }
    }

    togglePlay() {
        this.playing = !this.playing;
    }

    public get playing() {
        return this._playing;
    }
    public set playing(val: boolean) {
        this._playing = val;
        if (val) {
            this.trackForm.get('uiSliderControl').disable();
            this.howl.play('preview');
        } else {
            this.howl.stop();
            this.trackForm.get('uiSliderControl').enable();
        }
    }

    saveTrack() {
        let observable: Observable<string>;
        this.trackForm.disable();
        if (this.data.track && this.data.track.data_id !== null) {
            observable = this.trackDataService.update({
                _id: this.data.track.data_id,
                base64: this.trackForm.get('data').value,
            });
        } else {
            observable = this.trackDataService.add({
                _id: null,
                base64: this.trackForm.get('data').value,
            });
        }
        observable.subscribe(trackDataId => {
            const track = {
                title: this.trackForm.get('title').value,
                artists: this.trackForm.get('artists').value,
                data_id: trackDataId,
                order: this.trackForm.get('order').value,
                duration: this.trackForm.get('duration').value,
                offset: this.trackForm.get('offset').value,
            };
            this.dialogRef.close(track);
        });
    }
}
