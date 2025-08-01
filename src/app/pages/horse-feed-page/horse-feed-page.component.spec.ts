import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseFeedPageComponent } from './horse-feed-page.component';

describe('HorseFeedPageComponent', () => {
  let component: HorseFeedPageComponent;
  let fixture: ComponentFixture<HorseFeedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorseFeedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorseFeedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
