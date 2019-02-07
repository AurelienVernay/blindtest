import { ExtractResponseInterceptor } from './interceptors/extract-response-nterceptor';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NouisliderModule } from 'ng2-nouislider';

import { ConfirmDeleteItemComponent } from './confirm-delete-item/confirm-delete-item.component';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { BlindtestService } from './services/blindtest.service';
import { ConfigService } from './services/config.service';
import { RouterModule } from '@angular/router';

const matModules = [
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatToolbarModule,
    MatChipsModule,
];

@NgModule({
    declarations: [TimeFormatPipe, ConfirmDeleteItemComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ...matModules,
        NouisliderModule,
    ],
    entryComponents: [ConfirmDeleteItemComponent],
    exports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ...matModules,
        NouisliderModule,
        TimeFormatPipe,
        RouterModule,
    ],
    providers: [
        BlindtestService,
        ConfigService,
        ExtractResponseInterceptor,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ExtractResponseInterceptor,
            multi: true,
        },
    ],
})
export class SharedModule {}
