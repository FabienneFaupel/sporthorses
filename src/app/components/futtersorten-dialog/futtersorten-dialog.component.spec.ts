import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuttersortenDialogComponent } from './futtersorten-dialog.component';

describe('FuttersortenDialogComponent', () => {
  let component: FuttersortenDialogComponent;
  let fixture: ComponentFixture<FuttersortenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuttersortenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuttersortenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
