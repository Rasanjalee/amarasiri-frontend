import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdatedPaymentsComponent } from './outdated-payments.component';

describe('OutdatedPaymentsComponent', () => {
  let component: OutdatedPaymentsComponent;
  let fixture: ComponentFixture<OutdatedPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutdatedPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutdatedPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
