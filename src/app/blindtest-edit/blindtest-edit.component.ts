import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Theme } from './../models/theme.model';
import { BlindtestService } from './../services/blindtest.service';
import { Blindtest } from './../models/blindtest.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AddThemeFormComponent } from '../add-theme-form/add-theme-form.component';

@Component({
    selector: 'app-blindtest-edit',
    templateUrl: './blindtest-edit.component.html',
    styleUrls: ['./blindtest-edit.component.css'],
})
export class BlindtestEditComponent implements OnInit, OnDestroy {
    private _$blindtest: Observable<Blindtest>;
    private subscription: Subscription;
    public get $blindtest() {
        return this._$blindtest;
    }
    public set $blindtest(observable: Observable<Blindtest>) {
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
    private _themes: Theme[];
    public get themes() {
        return !this._themes
            ? []
            : this._themes.sort((a, b) => a.order - b.order);
    }
    public set themes(themes: Theme[]) {
        this._themes = themes;
    }
    public gloubi: Theme;
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
        this.$blindtest = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.btService.get(+params.get('id'))
            )
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onUpdateTheme(theme: Theme) {
        this.$blindtest = this.btService.update(
            new Blindtest(
                this.blindtest.id,
                this.blindtest.title,
                this.blindtest.author,
                [
                    ...this.blindtest.themes.filter(
                        find => find.id !== theme.id
                    ),
                    theme,
                ],
                this.blindtest.gloubi
            )
        );
    }
    public onAddTheme() {
        this.dialogRef = this.dialog.open(AddThemeFormComponent);
        this.dialogRef.afterClosed().subscribe(themeName => {
            if (themeName) {
                this.$blindtest = this.btService.update(
                    new Blindtest(
                        this.blindtest.id,
                        this.blindtest.title,
                        this.blindtest.author,
                        [
                            ...this.themes,
                            new Theme(
                                [],
                                themeName,
                                null,
                                this.themes.length + 1
                            ),
                        ]
                    )
                );
            }
        });
    }

    public onDeleteTheme(theme: Theme) {
        this.$blindtest = this.btService.update(
            new Blindtest(
                this.blindtest.id,
                this.blindtest.title,
                this.blindtest.author,
                [...this.themes.filter(find => find.order !== theme.order)],
                this.blindtest.gloubi
            )
        );
    }
    public onAddGloubi() {
        this.$blindtest = this.btService.update(
            new Blindtest(
                this.blindtest.id,
                this.blindtest.title,
                this.blindtest.author,
                this.blindtest.themes,
                new Theme([])
            )
        );
    }

    public onUpdateBlindtest() {
        this.$blindtest = this.btService.update({
            ...this.blindtest,
            ...this.blindtestForm.value,
        });
    }
    public onUpdateGloubi(gloubi: Theme) {
        this.$blindtest = this.btService.update(
            new Blindtest(
                this.blindtest.id,
                this.blindtest.title,
                this.blindtest.author,
                this.blindtest.themes,
                new Theme(gloubi.tracks)
            )
        );
    }
    public onDeleteGloubi() {
        delete this.blindtest.gloubi;
        this.$blindtest = this.btService.update(this.blindtest);
    }
}
