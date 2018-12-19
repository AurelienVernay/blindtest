import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteItemComponent } from './confirm-delete-item.component';

describe('ConfirmDeleteTrackComponent', () => {
    let component: ConfirmDeleteItemComponent;
    let fixture: ComponentFixture<ConfirmDeleteItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmDeleteItemComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmDeleteItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
