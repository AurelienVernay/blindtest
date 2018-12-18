import { BlindtestEditComponent } from './blindtest-edit/blindtest-edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlindtestsListComponent } from './blindtests-list/blindtests-list.component';

const routes: Routes = [
    {
        path: 'blindtests',
        component: BlindtestsListComponent,
    },
    {
        path: 'blindtest/:id',
        component: BlindtestEditComponent,
    },
    { path: '', redirectTo: '/blindtests', pathMatch: 'full' },
    {
        path: '**',
        component: BlindtestsListComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
