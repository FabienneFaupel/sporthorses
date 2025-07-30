import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingFailedBoxComponent } from './loading-failed-box.component';

describe('LoadingFailedBoxComponent', () => {
  let component: LoadingFailedBoxComponent;
  let fixture: ComponentFixture<LoadingFailedBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingFailedBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingFailedBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
