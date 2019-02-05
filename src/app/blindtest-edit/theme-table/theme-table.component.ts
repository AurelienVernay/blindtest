import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDeleteItemComponent } from '../../shared/confirm-delete-item/confirm-delete-item.component';
import { Theme } from '../../shared/models/theme.model';
import { Track } from '../../shared/models/track.model';
import { EditTrackComponent } from './../edit-track/edit-track.component';

@Component({
    selector: 'app-theme-table',
    templateUrl: './theme-table.component.html',
    styleUrls: ['./theme-table.component.css'],
})
export class ThemeTableComponent implements OnInit {
    private dialogEdit: MatDialogRef<EditTrackComponent>;
    private dialogConfirmDelete: MatDialogRef<ConfirmDeleteItemComponent>;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    @Input() public theme: Theme;
    public get tracks() {
        return this.theme
            ? this.theme.tracks.sort((a, b) => a.order - b.order)
            : [];
    }
    public themeForm: FormGroup;
    public trackForm: FormGroup;
    public columnsToDisplay = [
        'order',
        'artists',
        'title',
        'duration',
        'actions',
    ];

    @Output() updateTheme = new EventEmitter<Theme>();

    @Output() deleteTheme = new EventEmitter();

    constructor(private fb: FormBuilder, private dialog: MatDialog) {}

    ngOnInit() {
        this.themeForm = this.fb.group({
            name: this.fb.control(this.theme.name, Validators.required),
            order: this.fb.control(this.theme.order, Validators.required),
        });
        this.trackForm = this.fb.group({
            order: this.fb.control(
                {
                    value: this.theme.tracks.length + 1,
                    disabled: true,
                },
                Validators.required
            ),
            artists: this.fb.control([], Validators.required),
            title: this.fb.control('', Validators.required),
        });
    }

    public onDeleteTrack(track: Track) {
        this.dialogConfirmDelete = this.dialog.open(
            ConfirmDeleteItemComponent,
            {
                data: track.title,
            }
        );
        this.dialogConfirmDelete.afterClosed().subscribe(confirm => {
            if (confirm) {
                // filter tracks
                const tracks: Track[] = this.theme.tracks.filter(
                    find => find.order !== track.order
                );
                // reorder tracks
                tracks.forEach(
                    (unorderedTrack, i) => (unorderedTrack.order = i + 1)
                );
                this.updateTheme.emit(
                    new Theme(
                        [...tracks],
                        this.theme.name,
                        this.theme.id,
                        this.theme.order
                    )
                );
            }
        });
    }
    public onAddTrack() {
        this.trackForm.controls['order'].enable();
        this.updateTheme.emit(
            new Theme(
                [
                    ...this.theme.tracks,
                    {
                        ...this.trackForm.value,
                    },
                ],
                this.theme.name,
                this.theme.id,
                this.theme.order
            )
        );

        this.trackForm.controls['order'].disable();
    }

    public onModifyTheme() {
        this.updateTheme.emit({ ...this.theme, ...this.themeForm.value });
    }

    public onEditTrack(track: Track) {
        this.dialogEdit = this.dialog.open(EditTrackComponent, {
            data: { track: track, isGloubi: false },
        });
        this.dialogEdit.afterClosed().subscribe(result => {
            if (result) {
                this.updateTheme.emit(
                    new Theme(
                        [
                            ...this.theme.tracks.filter(
                                find => find.order !== track.order
                            ),
                            {
                                ...result,
                            },
                        ],
                        this.theme.name,
                        this.theme.id,
                        this.theme.order
                    )
                );
            }
        });
    }
    public getThemeDuration() {
        let sum = 0;
        this.theme.tracks.forEach(
            track =>
                (sum += track.durationRange
                    ? track.durationRange[1] - track.durationRange[0]
                    : 0)
        );
        return sum;
    }

    public onDeleteThemeClicked() {
        this.dialogConfirmDelete = this.dialog.open(
            ConfirmDeleteItemComponent,
            { data: this.theme.name }
        );
        this.dialogConfirmDelete.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.deleteTheme.emit();
            }
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
