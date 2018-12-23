import { CreateBlindtestFormComponent } from './../create-blindtest-form/create-blindtest-form.component';
import { Blindtest } from './../models/blindtest.model';
import { BlindtestService } from './../services/blindtest.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-blindtests-list',
    templateUrl: './blindtests-list.component.html',
    styleUrls: ['./blindtests-list.component.css'],
})
export class BlindtestsListComponent implements OnInit {
    public blindtests = [];
    public columnsToDisplay = ['blindtestName', 'author', 'actions'];
    public dialogRef: MatDialogRef<CreateBlindtestFormComponent>;
    constructor(
        private btService: BlindtestService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.btService
            .getAll()
            .subscribe(blindtests => (this.blindtests = blindtests));
    }

    public viewBlindtest(blindtest: Blindtest) {
        this.router.navigate([`blindtest/${blindtest.id}`]);
    }
    public addNewBlindtest() {
        this.dialogRef = this.dialog.open(CreateBlindtestFormComponent);
        this.dialogRef.afterClosed().subscribe(blindtest => {
            if (blindtest && blindtest.title) {
                this.btService.add(blindtest).subscribe(createdBlindtest => {
                    this.router.navigate([`blindtest/${createdBlindtest.id}`]);
                });
            }
        });
    }

    public isValid(blindtest: Blindtest) {
        return Blindtest.isValid(blindtest);
    }
}
