import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuchtHorseSelectSheetComponent } from './zucht-horse-select-sheet.component';

describe('ZuchtHorseSelectSheetComponent', () => {
  let component: ZuchtHorseSelectSheetComponent;
  let fixture: ComponentFixture<ZuchtHorseSelectSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZuchtHorseSelectSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZuchtHorseSelectSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
