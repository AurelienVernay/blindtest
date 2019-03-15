import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, concat } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Blindtest } from '../../shared/models/blindtest.model';
import { BlindtestService } from '../../shared/services/blindtest.service';
import { ConfirmDeleteItemComponent } from './../../shared/confirm-delete-item/confirm-delete-item.component';
import { CreateBlindtestFormComponent } from './../create-blindtest-form/create-blindtest-form.component';

@Component({
    selector: 'app-blindtests-list',
    templateUrl: './blindtests-list.component.html',
    styleUrls: ['./blindtests-list.component.css'],
})
export class BlindtestsListComponent implements OnInit {
    public blindtests$: Observable<Blindtest[]>;

    public columnsToDisplay = ['blindtestName', 'author', 'actions'];
    public dialogCreateBtRef: MatDialogRef<CreateBlindtestFormComponent>;
    public dialogDelBtRef: MatDialogRef<ConfirmDeleteItemComponent>;
    constructor(
        private btService: BlindtestService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.blindtests$ = this.btService.getAll();
    }

    public viewBlindtest(blindtest: Blindtest) {
        this.router.navigate([`blindtest/${blindtest._id}`]);
    }
    public addNewBlindtest() {
        this.dialogCreateBtRef = this.dialog.open(CreateBlindtestFormComponent);
        this.dialogCreateBtRef.afterClosed().subscribe(blindtest => {
            if (blindtest && blindtest.title) {
                this.btService.add(blindtest).subscribe(createdBlindtest => {
                    this.router.navigate([`blindtest/${createdBlindtest._id}`]);
                });
            }
        });
    }
    public onDeleteBlindtest(blindtest: Blindtest) {
        this.dialogDelBtRef = this.dialog.open(ConfirmDeleteItemComponent, {
            data: blindtest.title,
        });
        this.blindtests$ = this.dialogDelBtRef.afterClosed().pipe(
            filter(response => response === 'true'),
            switchMap(() =>
                concat(
                    this.btService.delete(blindtest),
                    this.btService.getAll()
                )
            )
        );
    }
}
