import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
    MatDialogModule,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
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
import { RouterModule } from '@angular/router';
import { NouisliderModule } from 'ng2-nouislider';

import { ConfirmDeleteItemComponent } from './confirm-delete-item/confirm-delete-item.component';
import { ExtractResponseInterceptor } from './interceptors/extract-response-nterceptor';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { BlindtestService } from './services/blindtest.service';
import { ConfigService } from './services/config.service';

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
    declarations: [
        TimeFormatPipe,
        ConfirmDeleteItemComponent,
        LoadingSpinnerComponent,
    ],
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
        FlexLayoutModule,
        TimeFormatPipe,
        RouterModule,
        LoadingSpinnerComponent,
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
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: MAT_DIALOG_DATA,
                    multi: true,
                },
            ],
        };
    }
}
