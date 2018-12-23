import { BlindtestService } from './services/blindtest.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlindtestsListComponent } from './blindtests-list/blindtests-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BlindtestEditComponent } from './blindtest-edit/blindtest-edit.component';
import { ThemeTableComponent } from './theme-table/theme-table.component';
import { GloubiTableComponent } from './gloubi-table/gloubi-table.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { CreateBlindtestFormComponent } from './create-blindtest-form/create-blindtest-form.component';
import { AddThemeFormComponent } from './add-theme-form/add-theme-form.component';
import { EditTrackComponent } from './edit-track/edit-track.component';
import { ConfirmDeleteItemComponent } from './confirm-delete-item/confirm-delete-item.component';
import { NouisliderModule } from 'ng2-nouislider';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { BlindtestPlayerComponent } from './blindtest-player/blindtest-player.component';

const matModules = [
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatChipsModule,
];

@NgModule({
    declarations: [
        AppComponent,
        BlindtestsListComponent,
        BlindtestEditComponent,
        ThemeTableComponent,
        GloubiTableComponent,
        CreateBlindtestFormComponent,
        AddThemeFormComponent,
        EditTrackComponent,
        ConfirmDeleteItemComponent,
        TimeFormatPipe,
        BlindtestPlayerComponent,
    ],
    entryComponents: [
        CreateBlindtestFormComponent,
        AddThemeFormComponent,
        EditTrackComponent,
        ConfirmDeleteItemComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        ...matModules,
        NouisliderModule,
    ],
    providers: [BlindtestService],
    bootstrap: [AppComponent],
})
export class AppModule {}
