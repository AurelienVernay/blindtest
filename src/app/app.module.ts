import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlindtestEditModule } from './blindtest-edit/blindtest-edit.module';
import { BlindtestPlayerModule } from './blindtest-player/blindtest-player.module';
import { BlindtestsListModule } from './blindtests-list/blindtests-list.module';
import { MainModule } from './main/main.module';
import { ToolbarModule } from './toolbar/toolbar.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BlindtestEditModule,
        BlindtestsListModule,
        BlindtestPlayerModule,
        ToolbarModule,
        MainModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
