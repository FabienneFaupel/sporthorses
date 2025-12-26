import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuttersortenPageComponent } from './futtersorten-page.component';

describe('FuttersortenPageComponent', () => {
  let component: FuttersortenPageComponent;
  let fixture: ComponentFixture<FuttersortenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuttersortenPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuttersortenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
