import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuchtRosseDialogComponent } from './zucht-rosse-dialog.component';

describe('ZuchtRosseDialogComponent', () => {
  let component: ZuchtRosseDialogComponent;
  let fixture: ComponentFixture<ZuchtRosseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZuchtRosseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZuchtRosseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
