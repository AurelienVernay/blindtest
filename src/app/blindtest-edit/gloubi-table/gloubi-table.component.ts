import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDeleteItemComponent } from '../../shared/confirm-delete-item/confirm-delete-item.component';
import { Theme } from '../../shared/models/theme.model';
import { Track } from '../../shared/models/track.model';
import { EditTrackComponent } from './../edit-track/edit-track.component';

@Component({
    selector: 'app-gloubi-table',
    templateUrl: './gloubi-table.component.html',
    styleUrls: ['./gloubi-table.component.css'],
})
export class GloubiTableComponent implements OnInit {
    private dialogEdit: MatDialogRef<EditTrackComponent>;
    private _gloubi: Theme;
    public get gloubi() {
        return this._gloubi;
    }
    public get tracks() {
        return this.gloubi
            ? this.gloubi.tracks.sort((a, b) => a.order - b.order)
            : [];
    }

    @Input()
    public set gloubi(gloubi: Theme) {
        this._gloubi = gloubi;
        this.gloubiForm = this.fb.group({
            title: this.fb.control(null, Validators.required),
            order: this.fb.control(
                {
                    value: this.gloubi.tracks.length + 1,
                    disabled: true,
                },
                Validators.required
            ),
        });
        this.gloubiForm.markAsPristine();
    }
    @Output() updateGloubi = new EventEmitter<Theme>();
    @Output() deleteGloubi = new EventEmitter();
    public columnsToDisplay = ['order', 'title', 'actions'];
    public gloubiForm: FormGroup;
    public dialogCOnfirmDelete: MatDialogRef<ConfirmDeleteItemComponent>;
    constructor(private fb: FormBuilder, private dialog: MatDialog) {}

    ngOnInit() {}

    public deleteTrack(track: Track) {
        this.dialogCOnfirmDelete = this.dialog.open(
            ConfirmDeleteItemComponent,
            {
                data: track.title,
            }
        );
        this.dialogCOnfirmDelete.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.updateGloubi.emit(
                    new Theme(
                        this.gloubi.tracks.filter(
                            find => find.order !== track.order
                        ),
                        this.gloubi.name,
                        this.gloubi.id
                    )
                );
            }
        });
    }

    public addNewTrack() {
        this.gloubiForm.controls['order'].enable();
        this.updateGloubi.emit(
            new Theme(
                [
                    ...this.gloubi.tracks,
                    {
                        ...this.gloubiForm.value,
                    },
                ],
                this.gloubi.name,
                this.gloubi.id
            )
        );
        this.gloubiForm.controls['order'].disable();
    }

    public onDeleteGloubi() {
        this.dialogCOnfirmDelete = this.dialog.open(
            ConfirmDeleteItemComponent,
            { data: 'Gloubi-boulga' }
        );
        this.dialogCOnfirmDelete.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.deleteGloubi.emit();
            }
        });
    }

    public editTrack(track: Track) {
        this.dialogEdit = this.dialog.open(EditTrackComponent, {
            data: { track: track, isGloubi: true },
        });
        this.dialogEdit.afterClosed().subscribe(result => {
            if (result) {
                this.updateGloubi.emit(
                    new Theme(
                        [
                            ...this.gloubi.tracks.filter(
                                find => find.order !== track.order
                            ),
                            {
                                ...result,
                            },
                        ],
                        this.gloubi.name,
                        this.gloubi.id,
                        this.gloubi.order
                    )
                );
            }
        });
    }
}