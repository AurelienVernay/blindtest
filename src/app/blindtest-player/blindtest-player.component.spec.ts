import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindtestPlayerComponent } from './blindtest-player.component';

describe('BlindtestPlayerComponent', () => {
  let component: BlindtestPlayerComponent;
  let fixture: ComponentFixture<BlindtestPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlindtestPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlindtestPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
