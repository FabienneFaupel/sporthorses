import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuchtChangeSheetComponent } from './zucht-change-sheet.component';

describe('ZuchtChangeSheetComponent', () => {
  let component: ZuchtChangeSheetComponent;
  let fixture: ComponentFixture<ZuchtChangeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZuchtChangeSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZuchtChangeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
