import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KraftfutterPageComponent } from './kraftfutter-page.component';

describe('KraftfutterPageComponent', () => {
  let component: KraftfutterPageComponent;
  let fixture: ComponentFixture<KraftfutterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KraftfutterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KraftfutterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
