import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThemeFormComponent } from './add-theme-form.component';

describe('AddThemeFormComponent', () => {
  let component: AddThemeFormComponent;
  let fixture: ComponentFixture<AddThemeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddThemeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThemeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
