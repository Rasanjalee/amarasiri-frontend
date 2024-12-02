import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseAppSettingsComponent } from './lease-app-settings.component';

describe('LeaseAppSettingsComponent', () => {
  let component: LeaseAppSettingsComponent;
  let fixture: ComponentFixture<LeaseAppSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaseAppSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaseAppSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
