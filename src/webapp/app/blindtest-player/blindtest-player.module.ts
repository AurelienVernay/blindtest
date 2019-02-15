import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BlindtestPlayerComponent } from './blindtest-player.component';

@NgModule({
    declarations: [BlindtestPlayerComponent],
    imports: [SharedModule],
})
export class BlindtestPlayerModule {}
