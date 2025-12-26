import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutterplanAddDialogComponent } from './futterplan-add-dialog.component';

describe('FutterplanAddDialogComponent', () => {
  let component: FutterplanAddDialogComponent;
  let fixture: ComponentFixture<FutterplanAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutterplanAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutterplanAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
