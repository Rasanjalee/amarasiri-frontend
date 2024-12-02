import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseDetailsComponent } from './lease-details.component';

describe('LeaseDetailsComponent', () => {
  let component: LeaseDetailsComponent;
  let fixture: ComponentFixture<LeaseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
