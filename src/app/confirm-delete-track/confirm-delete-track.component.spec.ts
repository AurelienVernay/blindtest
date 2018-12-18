import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteTrackComponent } from './confirm-delete-track.component';

describe('ConfirmDeleteTrackComponent', () => {
  let component: ConfirmDeleteTrackComponent;
  let fixture: ComponentFixture<ConfirmDeleteTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
