import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeaseComponent } from './new-lease.component';

describe('NewLeaseComponent', () => {
  let component: NewLeaseComponent;
  let fixture: ComponentFixture<NewLeaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLeaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
