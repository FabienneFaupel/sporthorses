import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutterplanPageComponent } from './futterplan-page.component';

describe('FutterplanPageComponent', () => {
  let component: FutterplanPageComponent;
  let fixture: ComponentFixture<FutterplanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutterplanPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutterplanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
