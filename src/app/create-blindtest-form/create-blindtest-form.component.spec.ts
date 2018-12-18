import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBlindtestFormComponent } from './create-blindtest-form.component';

describe('CreateBlindtestFormComponent', () => {
  let component: CreateBlindtestFormComponent;
  let fixture: ComponentFixture<CreateBlindtestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBlindtestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBlindtestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
