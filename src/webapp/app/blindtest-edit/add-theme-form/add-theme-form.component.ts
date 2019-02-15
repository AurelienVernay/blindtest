import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-theme-form',
    templateUrl: './add-theme-form.component.html',
    styleUrls: ['./add-theme-form.component.css'],
})
export class AddThemeFormComponent implements OnInit {
    public themeForm: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<AddThemeFormComponent>,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.themeForm = this.fb.group({
            name: this.fb.control('', Validators.required),
        });
    }
    addTheme() {
        this.dialogRef.close(this.themeForm.controls['name'].value);
    }
}
