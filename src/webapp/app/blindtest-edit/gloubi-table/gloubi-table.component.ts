import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDeleteItemComponent } from '../../shared/confirm-delete-item/confirm-delete-item.component';
import { ITheme } from '../../../../interfaces/theme.interface';
import { ITrack } from '../../../../interfaces/track.model';
import { EditTrackComponent } from './../edit-track/edit-track.component';
import { Theme } from '../../shared/models/theme.model';

@Component({
    selector: 'app-gloubi-table',
    templateUrl: './gloubi-table.component.html',
    styleUrls: ['./gloubi-table.component.css'],
})
export class GloubiTableComponent implements OnInit {
    private dialogEdit: MatDialogRef<EditTrackComponent>;
    private _gloubi: ITheme;
    public get gloubi() {
        return this._gloubi;
    }
    public get tracks() {
        return this.gloubi
            ? this.gloubi.tracks.sort((a, b) => a.orderRank - b.orderRank)
            : [];
    }

    @Input()
    public set gloubi(gloubi: ITheme) {
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
    @Output() updateGloubi = new EventEmitter<ITheme>();
    @Output() deleteGloubi = new EventEmitter();
    public columnsToDisplay = ['order', 'title', 'actions'];
    public gloubiForm: FormGroup;
    public dialogCOnfirmDelete: MatDialogRef<ConfirmDeleteItemComponent>;
    constructor(private fb: FormBuilder, private dialog: MatDialog) {}

    ngOnInit() {}

    public deleteTrack(track: ITrack) {
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
                            find => find.orderRank !== track.orderRank
                        ),
                        this.gloubi.name
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
                this.gloubi.name
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

    public editTrack(track: ITrack) {
        this.dialogEdit = this.dialog.open(EditTrackComponent, {
            data: { track: track, isGloubi: true },
        });
        this.dialogEdit.afterClosed().subscribe(result => {
            if (result) {
                this.updateGloubi.emit(
                    new Theme(
                        [
                            ...this.gloubi.tracks.filter(
                                find => find.orderRank !== track.orderRank
                            ),
                            {
                                ...result,
                            },
                        ],
                        this.gloubi.name,
                        this.gloubi.orderRank
                    )
                );
            }
        });
    }
}
