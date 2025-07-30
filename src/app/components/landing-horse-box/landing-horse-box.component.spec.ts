import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingHorseBoxComponent } from './landing-horse-box.component';

describe('LandingHorseBoxComponent', () => {
  let component: LandingHorseBoxComponent;
  let fixture: ComponentFixture<LandingHorseBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingHorseBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingHorseBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
