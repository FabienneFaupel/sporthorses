import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KraftfutterAddDialogComponent } from './kraftfutter-add-dialog.component';

describe('KraftfutterAddDialogComponent', () => {
  let component: KraftfutterAddDialogComponent;
  let fixture: ComponentFixture<KraftfutterAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KraftfutterAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KraftfutterAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
