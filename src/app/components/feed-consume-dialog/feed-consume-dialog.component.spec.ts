import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedConsumeDialogComponent } from './feed-consume-dialog.component';

describe('FeedConsumeDialogComponent', () => {
  let component: FeedConsumeDialogComponent;
  let fixture: ComponentFixture<FeedConsumeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedConsumeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedConsumeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
