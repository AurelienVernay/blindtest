import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindtestEditComponent } from './blindtest-edit.component';

describe('BlindtestEditComponent', () => {
  let component: BlindtestEditComponent;
  let fixture: ComponentFixture<BlindtestEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlindtestEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindtestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
