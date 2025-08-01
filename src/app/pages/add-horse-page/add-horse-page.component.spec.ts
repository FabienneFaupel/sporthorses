import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHorsePageComponent } from './add-horse-page.component';

describe('AddHorsePageComponent', () => {
  let component: AddHorsePageComponent;
  let fixture: ComponentFixture<AddHorsePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHorsePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHorsePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
