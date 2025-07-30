import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarrierPageComponent } from './farrier-page.component';

describe('FarrierPageComponent', () => {
  let component: FarrierPageComponent;
  let fixture: ComponentFixture<FarrierPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarrierPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarrierPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
