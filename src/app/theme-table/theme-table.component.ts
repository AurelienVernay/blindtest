import { EditTrackComponent } from './../edit-track/edit-track.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Theme } from '../models/theme.model';
import { Track } from '../models/track.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDeleteTrackComponent } from '../confirm-delete-track/confirm-delete-track.component';

@Component({
    selector: 'app-theme-table',
    templateUrl: './theme-table.component.html',
    styleUrls: ['./theme-table.component.css'],
})
export class ThemeTableComponent implements OnInit {
    @Input() public theme: Theme;
    public themeForm: FormGroup;
    public trackForm: FormGroup;
    public columnsToDisplay = ['order', 'artists', 'title', 'actions'];
    @Output() updateTheme = new EventEmitter<Theme>();
    private dialogEdit: MatDialogRef<EditTrackComponent>;
    private dialogConfirmDelete: MatDialogRef<ConfirmDeleteTrackComponent>;
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
            artists: this.fb.control('', Validators.required),
            title: this.fb.control('', Validators.required),
        });
    }

    public onDeleteTrack(track: Track) {
        this.dialogConfirmDelete = this.dialog.open(
            ConfirmDeleteTrackComponent
        );
        // filter tracks
        const tracks: Track[] = this.theme.tracks.filter(
            find => find.order !== track.order
        );
        // reorder tracks
        tracks.forEach((unorderedTrack, i) => (unorderedTrack.order = i + 1));
        this.updateTheme.emit({
            ...this.theme,
            tracks: [...tracks],
        });
    }
    public onAddTrack() {
        this.trackForm.controls['order'].enable();
        this.updateTheme.emit({
            ...this.theme,
            tracks: [
                ...this.theme.tracks,
                {
                    ...this.trackForm.value,
                    artists: this.trackForm.controls['artists'].value.split(
                        ' '
                    ),
                },
            ],
        });
        this.trackForm.controls['order'].disable();
    }

    public onModifyTheme() {
        this.updateTheme.emit({ ...this.theme, ...this.themeForm.value });
    }

    public onEditTrack(track: Track) {
        this.dialogEdit = this.dialog.open(EditTrackComponent, {
            data: { track: track, isGloubi: false },
        });
    }
}
