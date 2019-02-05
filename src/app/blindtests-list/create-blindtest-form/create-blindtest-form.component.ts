import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-create-blindtest-form',
    templateUrl: './create-blindtest-form.component.html',
    styleUrls: ['./create-blindtest-form.component.css'],
})
export class CreateBlindtestFormComponent implements OnInit {
    public blindtestForm: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<CreateBlindtestFormComponent>,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.blindtestForm = this.fb.group({
            title: this.fb.control('', Validators.required),
            author: this.fb.control('', Validators.required),
        });
    }

    public createBlindtest() {
        this.dialogRef.close({
            ...this.blindtestForm.value,
            themes: [],
        });
    }
}
