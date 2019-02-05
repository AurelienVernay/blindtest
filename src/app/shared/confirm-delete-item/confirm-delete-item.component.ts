import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
    selector: 'app-confirm-delete-item',
    templateUrl: './confirm-delete-item.component.html',
    styleUrls: ['./confirm-delete-item.component.css'],
})
export class ConfirmDeleteItemComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {}
}
