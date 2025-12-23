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
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



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
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(60)]],
        age: [null, [Validators.required, Validators.min(0), Validators.max(50)]],
        gender: [null, Validators.required],
        birth: [''],
        breed: [''],
        father: [''],
        mother: [''],
        motherFather: [''],
        grandfather: [''],
        grandmother: ['']
      },
      { validators: this.ageBirthMismatchValidator() }
    );

    // ✅ Auto-Sync: birth -> age passend setzen (Stichtag 01.01.)
    this.form.get('birth')?.valueChanges.subscribe(v => {
      if (!v) {
        this.form.updateValueAndValidity({ emitEvent: false });
        return;
      }

      const expected = this.expectedAgeFromBirth(v);
      if (expected === null) return;

      this.form.get('age')?.setValue(expected, { emitEvent: false });
      this.form.updateValueAndValidity({ emitEvent: false });
    });

    // --- Edit Mode patch ---
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
        grandmother: this.horse.pedigree?.grandmother
      });

      this.form.updateValueAndValidity({ emitEvent: false });
    }
  }

  private expectedAgeFromBirth(birth: any): number | null {
    if (!birth) return null;
    const d = new Date(birth);
    if (isNaN(d.getTime())) return null;
    return new Date().getFullYear() - d.getFullYear(); // Stichtag 01.01
  }

  private ageBirthMismatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const birthCtrl = group.get('birth');
    const ageCtrl = group.get('age');

    const birth = birthCtrl?.value;

    // birth leer -> mismatch entfernen
    if (!birth) {
      this.clearControlError(ageCtrl, 'ageBirthMismatch');
      this.clearControlError(birthCtrl, 'ageBirthMismatch');
      return null;
    }

    const expected = this.expectedAgeFromBirth(birth);
    if (expected === null) return null;

    const age = Number(ageCtrl?.value);
    const mismatch = !Number.isFinite(age) || age !== expected;

    if (mismatch) {
      ageCtrl?.setErrors({ ...(ageCtrl.errors ?? {}), ageBirthMismatch: true });
      birthCtrl?.setErrors({ ...(birthCtrl.errors ?? {}), ageBirthMismatch: true });
      return { ageBirthMismatch: true };
    }

    this.clearControlError(ageCtrl, 'ageBirthMismatch');
    this.clearControlError(birthCtrl, 'ageBirthMismatch');
    return null;
  };
}

private clearControlError(ctrl: AbstractControl | null | undefined, key: string) {
  if (!ctrl?.errors || !ctrl.hasError(key)) return;
  const { [key]: _, ...rest } = ctrl.errors;
  ctrl.setErrors(Object.keys(rest).length ? rest : null);
}


  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const birthIso = v.birth ? new Date(v.birth).toISOString().slice(0, 10) : '';
    const currentYear = new Date().getFullYear();
    const ageBaseYear = birthIso ? undefined : currentYear;

    if (this.editMode && this.horse) {
      const updated: Horse = {
        ...this.horse,
        name: v.name,
        breed: v.breed,
        age: Number(v.age),
        birth: birthIso,
        ageBaseYear,
        gender: v.gender,
        pedigree: {
          father: v.father,
          mother: v.mother,
          motherFather: v.motherFather,
          grandfather: v.grandfather,
          grandmother: v.grandmother
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
      const newHorse: Omit<Horse, '_id'|'_rev'|'docType'|'createdAt'|'updatedAt'> = {
        name: v.name,
        breed: v.breed,
        age: Number(v.age),
        birth: birthIso,
        ageBaseYear,
        gender: v.gender,
        vaccinations: [],
        farrierEntries: [],
        pedigree: {
          father: v.father,
          mother: v.mother,
          motherFather: v.motherFather,
          grandfather: v.grandfather,
          grandmother: v.grandmother
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