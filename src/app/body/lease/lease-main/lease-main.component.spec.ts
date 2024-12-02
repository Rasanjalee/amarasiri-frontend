import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseMainComponent } from './lease-main.component';

describe('LeaseMainComponent', () => {
  let component: LeaseMainComponent;
  let fixture: ComponentFixture<LeaseMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
