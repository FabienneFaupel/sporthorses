import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuchtZyklusSettingsDialogComponent } from './zucht-zyklus-settings-dialog.component';

describe('ZuchtZyklusSettingsDialogComponent', () => {
  let component: ZuchtZyklusSettingsDialogComponent;
  let fixture: ComponentFixture<ZuchtZyklusSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZuchtZyklusSettingsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZuchtZyklusSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
