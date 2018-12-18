import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindtestsListComponent } from './blindtests-list.component';

describe('BlindtestsListComponent', () => {
  let component: BlindtestsListComponent;
  let fixture: ComponentFixture<BlindtestsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlindtestsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindtestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
