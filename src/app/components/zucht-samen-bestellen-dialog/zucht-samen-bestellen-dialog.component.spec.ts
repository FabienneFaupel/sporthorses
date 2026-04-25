import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZuchtSamenBestellenDialogComponent } from './zucht-samen-bestellen-dialog.component';

describe('ZuchtSamenBestellenDialogComponent', () => {
  let component: ZuchtSamenBestellenDialogComponent;
  let fixture: ComponentFixture<ZuchtSamenBestellenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZuchtSamenBestellenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZuchtSamenBestellenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
