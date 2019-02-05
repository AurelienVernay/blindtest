import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BlindtestsListComponent } from './blindtests-list/blindtests-list.component';
import { CreateBlindtestFormComponent } from './create-blindtest-form/create-blindtest-form.component';

@NgModule({
    declarations: [BlindtestsListComponent, CreateBlindtestFormComponent],
    imports: [SharedModule],
    entryComponents: [CreateBlindtestFormComponent],
})
export class BlindtestsListModule {}
