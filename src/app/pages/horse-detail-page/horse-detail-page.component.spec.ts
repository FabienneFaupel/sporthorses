import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseDetailPageComponent } from './horse-detail-page.component';

describe('HorseDetailPageComponent', () => {
  let component: HorseDetailPageComponent;
  let fixture: ComponentFixture<HorseDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorseDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorseDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
