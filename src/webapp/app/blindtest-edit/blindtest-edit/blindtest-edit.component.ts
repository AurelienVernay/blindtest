import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ITheme } from '../../../../interfaces/theme.interface';
import { Theme } from '../../shared/models/theme.model';
import { BlindtestService } from '../../shared/services/blindtest.service';
import { AddThemeFormComponent } from '../add-theme-form/add-theme-form.component';
import { Blindtest } from './../../shared/models/blindtest.model';
import { Gloubi } from './../../shared/models/gloubi.model';

@Component({
    selector: 'app-blindtest-edit',
    templateUrl: './blindtest-edit.component.html',
    styleUrls: ['./blindtest-edit.component.css'],
})
export class BlindtestEditComponent implements OnInit, OnDestroy {
    private _$blindtest: Observable<Blindtest>;
    private subscription: Subscription;
    public get blindtest$() {
        return this._$blindtest;
    }
    public set blindtest$(observable: Observable<Blindtest>) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this._$blindtest = observable;
        this.subscription = this._$blindtest.subscribe(blindtest => {
            this.blindtest = blindtest;
            this.themes = blindtest.themes;
            this.gloubi = blindtest.gloubi;
            this.blindtestForm = this.fb.group({
                title: this.fb.control(blindtest.title, Validators.required),
                author: this.fb.control(blindtest.author, Validators.required),
            });
        });
    }
    public blindtest: Blindtest;
    private _themes: ITheme[];
    public get themes() {
        return !this._themes
            ? []
            : this._themes.sort((a, b) => a.orderRank - b.orderRank);
    }
    public set themes(themes: ITheme[]) {
        this._themes = themes;
    }
    public gloubi: ITheme;
    public blindtestForm: FormGroup;
    private dialogRef: MatDialogRef<AddThemeFormComponent>;
    constructor(
        private route: ActivatedRoute,
        private btService: BlindtestService,
        private dialog: MatDialog,
        private fb: FormBuilder
    ) {
        this.blindtestForm = this.fb.group({
            title: this.fb.control(''),
            author: this.fb.control(''),
        });
    }

    ngOnInit() {
        this.blindtest$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.btService.get(params.get('id'))
            )
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onUpdateTheme(theme: ITheme) {
        this.blindtest$ = this.btService.update({
            _id: this.blindtest._id,
            title: this.blindtest.title,
            author: this.blindtest.author,
            themes: [
                ...this.blindtest.themes.filter(
                    find => find.orderRank !== theme.orderRank
                ),
                theme,
            ],
            gloubi: this.blindtest.gloubi,
        });
    }
    public onAddTheme() {
        this.dialogRef = this.dialog.open(AddThemeFormComponent);
        this.dialogRef.afterClosed().subscribe(themeName => {
            if (themeName) {
                this.blindtest$ = this.btService.update({
                    _id: this.blindtest._id,
                    title: this.blindtest.title,
                    author: this.blindtest.author,
                    themes: [
                        ...this.themes,
                        new Theme([], themeName, this.themes.length + 1),
                    ],
                });
            }
        });
    }

    public onDeleteTheme(theme: ITheme) {
        this.blindtest$ = this.btService.update({
            _id: this.blindtest._id,
            title: this.blindtest.title,
            author: this.blindtest.author,
            themes: [
                ...this.themes.filter(
                    find => find.orderRank !== theme.orderRank
                ),
            ],
            gloubi: this.blindtest.gloubi,
        });
    }
    public onAddGloubi() {
        this.blindtest$ = this.btService.update({
            _id: this.blindtest._id,
            title: this.blindtest.title,
            author: this.blindtest.author,
            themes: this.blindtest.themes,
            gloubi: new Gloubi(),
        });
    }

    public onUpdateBlindtest() {
        this.blindtest$ = this.btService.update({
            ...this.blindtest,
            ...this.blindtestForm.value,
        });
    }
    public onUpdateGloubi(gloubi: ITheme) {
        this.blindtest$ = this.btService.update({
            _id: this.blindtest._id,
            title: this.blindtest.title,
            author: this.blindtest.author,
            themes: this.blindtest.themes,
            gloubi: { tracks: gloubi.tracks },
        });
    }
    public onDeleteGloubi() {
        delete this.blindtest.gloubi;
        this.blindtest$ = this.btService.update(this.blindtest);
    }
}
