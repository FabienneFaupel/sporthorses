import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuchtTierarztTerminDialogComponent } from './zucht-tierarzt-termin-dialog.component';

describe('ZuchtTierarztTerminDialogComponent', () => {
  let component: ZuchtTierarztTerminDialogComponent;
  let fixture: ComponentFixture<ZuchtTierarztTerminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZuchtTierarztTerminDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZuchtTierarztTerminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
