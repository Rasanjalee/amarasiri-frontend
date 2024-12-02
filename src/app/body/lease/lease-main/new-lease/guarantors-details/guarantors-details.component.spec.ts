import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorsDetailsComponent } from './guarantors-details.component';

describe('GuarantorsDetailsComponent', () => {
  let component: GuarantorsDetailsComponent;
  let fixture: ComponentFixture<GuarantorsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuarantorsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuarantorsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
