import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
    declarations: [ToolbarComponent],
    imports: [SharedModule],
    exports: [ToolbarComponent],
})
export class ToolbarModule {}
