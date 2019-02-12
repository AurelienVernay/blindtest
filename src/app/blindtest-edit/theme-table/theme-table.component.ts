import { EditTrackOption } from './../../shared/models/edit-track-options.model';
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
                    new Theme([...tracks], this.theme.name, this.theme.order)
                );
            }
        });
    }
    public onAddTrack() {
        const editTrackConfig: EditTrackOption = {
            mode: 'add',
            isGloubi: false,
            trackOrder: this.theme.tracks.length + 1,
        };
        this.dialogEdit = this.dialog.open(EditTrackComponent, {
            data: editTrackConfig,
        });
        this.dialogEdit.afterClosed().subscribe(track => {
            if (track) {
                this.updateTheme.emit({
                    ...this.theme,
                    tracks: [...this.theme.tracks, track],
                });
            }
        });
    }

    public onModifyTheme() {
        this.updateTheme.emit({ ...this.theme, ...this.themeForm.value });
    }

    public onEditTrack(track: Track) {
        const editTrackConfig: EditTrackOption = {
            mode: 'edit',
            isGloubi: false,
            track: track,
        };
        this.dialogEdit = this.dialog.open(EditTrackComponent, {
            data: editTrackConfig,
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
                        this.theme.order
                    )
                );
            }
        });
    }
    public getThemeDuration() {
        let sum = 0;
        this.theme.tracks.forEach(
            track => (sum += track.duration ? track.duration : 0)
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
}
