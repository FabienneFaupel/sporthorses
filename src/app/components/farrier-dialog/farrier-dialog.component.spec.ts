import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarrierDialogComponent } from './farrier-dialog.component';

describe('FarrierDialogComponent', () => {
  let component: FarrierDialogComponent;
  let fixture: ComponentFixture<FarrierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarrierDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarrierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
