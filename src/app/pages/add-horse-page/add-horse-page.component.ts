import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService, Horse } from '../../services/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


type Gender = 'Stute' | 'Hengst' | 'Wallach';

@Component({
  selector: 'app-add-horse-page',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-horse-page.component.html',
  styleUrl: './add-horse-page.component.scss'
})
export class AddHorsePageComponent {
form!: FormGroup;

  genders: Gender[] = ['Stute', 'Hengst', 'Wallach'];

  breeds = [
    'Hannoveraner','Friese','Oldenburger','Holsteiner','Quarter Horse',
    'Islandpferd','Tinker','Trakehner','Deutsches Reitpferd','Arabisches Vollblut'
  ];

  constructor(private fb: FormBuilder, private data: DataService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      age: [null, [Validators.required, Validators.min(0), Validators.max(50)]],
      gender: [null, Validators.required],
      birth: [''], // optional
      breed: [''],
      father: [''],
    mother: [''],
    motherFather: [''],
    grandfather: [''],
    grandmother: ['']  // optional
    });
  }

  get f() {
    return this.form.controls;
  }

  private toDDMMYYYY(v: any): string {
    if (!v) return '';
    if (typeof v === 'string' && /\d{2}\.\d{2}\.\d{4}/.test(v)) return v;
    const d = new Date(v);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const newHorse: Horse = {
      name: v['name'].trim(),
      age: v['age'],
      gender: v['gender'],
      birth: this.toDDMMYYYY(v['birth']),
      breed: (v['breed'] ?? '').trim(),
      vaccinations: [],
      farrierEntries: [],
      pedigree: {
    father: v.father?.trim(),
    mother: v.mother?.trim(),
    motherFather: v.motherFather?.trim(),
    grandfather: v.grandfather?.trim(),
    grandmother: v.grandmother?.trim()
  }
    };

    this.data.addHorse(newHorse);

    // nach dem Hinzufügen zurück zur Übersicht
    this.router.navigate(['/horses']);
  }

  onCancel() {
    this.router.navigate(['/horses']);
  }
}