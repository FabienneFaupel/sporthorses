import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuchtPageComponent } from './zucht-page.component';

describe('ZuchtPageComponent', () => {
  let component: ZuchtPageComponent;
  let fixture: ComponentFixture<ZuchtPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZuchtPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZuchtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
