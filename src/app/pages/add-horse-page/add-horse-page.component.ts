import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Horse } from '../../models/horse';
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
    MatNativeDateModule,
    RouterLink
  ],
  templateUrl: './add-horse-page.component.html',
  styleUrl: './add-horse-page.component.scss'
})
export class AddHorsePageComponent {
form!: FormGroup;

horse: Horse | null = null;
editMode = false;

get f() {
  return this.form.controls;
}



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
    birth: [''],
    breed: [''],
    fnProfileUrl: [
      '',
      [
        Validators.maxLength(300),
        Validators.pattern(/^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/i)
      ]
    ],
    father: [''],
    mother: [''],
    motherFather: [''],
    grandfather: [''],
    grandmother: ['']
  });

  const nav = history.state;
  if (nav && nav.editMode && nav.horse) {
    this.editMode = true;
    this.horse = nav.horse as Horse;
    this.form.patchValue({
      name: this.horse.name,
      age: this.horse.age,
      gender: this.horse.gender,
      birth: this.horse.birth ? new Date(this.horse.birth) : '',
      breed: this.horse.breed,
      father: this.horse.pedigree?.father,
      mother: this.horse.pedigree?.mother,
      motherFather: this.horse.pedigree?.motherFather,
      grandfather: this.horse.pedigree?.grandfather,
      grandmother: this.horse.pedigree?.grandmother,
    });
  }
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

  async onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const v = this.form.value;
  const birthIso = v.birth ? new Date(v.birth).toISOString().slice(0, 10) : '';

  if (this.editMode && this.horse) {
    // Update
    const updated: Horse = {
      ...this.horse,
      name: v.name,
      breed: v.breed,
      age: Number(v.age),
      birth: birthIso,
      gender: v.gender,
      pedigree: {
        father: v.father,
        mother: v.mother,
        motherFather: v.motherFather,
        grandfather: v.grandfather,
        grandmother: v.grandmother,
      }
    };

    try {
      await this.data.updateHorse(updated);
      this.router.navigate(['/horses', updated._id]);
    } catch (e) {
      console.error('Update fehlgeschlagen:', e);
      alert('Konnte nicht speichern.');
    }
  } else {
    // Neu anlegen
    const newHorse: Omit<Horse, '_id'|'_rev'|'docType'|'createdAt'|'updatedAt'> = {
      name: v.name,
      breed: v.breed,
      age: Number(v.age),
      birth: birthIso,
      gender: v.gender,
      vaccinations: [],
      farrierEntries: [],
      pedigree: {
        father: v.father,
        mother: v.mother,
        motherFather: v.motherFather,
        grandfather: v.grandfather,
        grandmother: v.grandmother,
      }
    };

    try {
      await this.data.addHorse(newHorse);
      this.router.navigate(['/horses']);
    } catch (e) {
      console.error('Pferd anlegen fehlgeschlagen:', e);
      alert('Konnte nicht speichern.');
    }
  }
}



  onCancel() {
    this.router.navigate(['/horses']);
  }
}