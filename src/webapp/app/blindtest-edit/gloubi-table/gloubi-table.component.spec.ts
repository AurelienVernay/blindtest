import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GloubiTableComponent } from './gloubi-table.component';

describe('GloubiTableComponent', () => {
  let component: GloubiTableComponent;
  let fixture: ComponentFixture<GloubiTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GloubiTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GloubiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
