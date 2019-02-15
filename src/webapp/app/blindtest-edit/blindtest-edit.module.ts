import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AddThemeFormComponent } from './add-theme-form/add-theme-form.component';
import { BlindtestEditComponent } from './blindtest-edit/blindtest-edit.component';
import { EditTrackComponent } from './edit-track/edit-track.component';
import { GloubiTableComponent } from './gloubi-table/gloubi-table.component';
import { ThemeTableComponent } from './theme-table/theme-table.component';

@NgModule({
    declarations: [
        BlindtestEditComponent,
        GloubiTableComponent,
        ThemeTableComponent,
        AddThemeFormComponent,
        EditTrackComponent,
    ],
    entryComponents: [EditTrackComponent, AddThemeFormComponent],
    imports: [SharedModule.forRoot()],
})
export class BlindtestEditModule {}
