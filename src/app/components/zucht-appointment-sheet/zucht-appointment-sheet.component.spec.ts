import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuchtAppointmentSheetComponent } from './zucht-appointment-sheet.component';

describe('ZuchtAppointmentSheetComponent', () => {
  let component: ZuchtAppointmentSheetComponent;
  let fixture: ComponentFixture<ZuchtAppointmentSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZuchtAppointmentSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZuchtAppointmentSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
