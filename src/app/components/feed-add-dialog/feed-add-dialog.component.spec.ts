import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedAddDialogComponent } from './feed-add-dialog.component';

describe('FeedAddDialogComponent', () => {
  let component: FeedAddDialogComponent;
  let fixture: ComponentFixture<FeedAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
