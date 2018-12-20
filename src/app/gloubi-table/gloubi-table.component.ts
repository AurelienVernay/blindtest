import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Theme } from '../models/theme.model';
import { Track } from '../models/track.model';
import { ConfirmDeleteItemComponent } from '../confirm-delete-item/confirm-delete-item.component';

@Component({
    selector: 'app-gloubi-table',
    templateUrl: './gloubi-table.component.html',
    styleUrls: ['./gloubi-table.component.css'],
})
export class GloubiTableComponent implements OnInit {
    private _gloubi: Theme;
    public get gloubi() {
        return this._gloubi;
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
                this.updateGloubi.emit({
                    ...this.gloubi,
                    tracks: this.gloubi.tracks.filter(
                        find => find.order !== track.order
                    ),
                });
            }
        });
    }

    public addNewTrack() {
        this.gloubiForm.controls['order'].enable();
        this.updateGloubi.emit({
            ...this.gloubi,
            tracks: [...this.gloubi.tracks, this.gloubiForm.value],
        });
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
}
