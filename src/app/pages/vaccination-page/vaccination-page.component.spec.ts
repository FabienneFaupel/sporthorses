import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationPageComponent } from './vaccination-page.component';

describe('VaccinationPageComponent', () => {
  let component: VaccinationPageComponent;
  let fixture: ComponentFixture<VaccinationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaccinationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaccinationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
