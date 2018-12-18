import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTableComponent } from './theme-table.component';

describe('ThemeTableComponent', () => {
  let component: ThemeTableComponent;
  let fixture: ComponentFixture<ThemeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
