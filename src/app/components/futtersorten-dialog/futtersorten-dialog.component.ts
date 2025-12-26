import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';


import { FeedBaseType, FeedDefinition, UnitKey } from '../../models/feed-definition';

export interface FuttersortenDialogData {
  mode: 'add' | 'edit';
  preset?: Partial<FeedDefinition>;
  initial?: FeedDefinition;
}

type Scope = 'both' | 'feedplan';

interface BaseTypeOption {
  key: FeedBaseType;
  label: string;
  iconPath: string;
  defaultScope: Scope;
  // ob allowedUnits konfigurierbar sein soll:
  isCustomUnitType: boolean; // true für zusatzfutter/medizin
}

const BASE_TYPES: BaseTypeOption[] = [
  { key: 'hafer',       label: 'Hafer',       iconPath: '/images/hafer.svg',        defaultScope: 'both',     isCustomUnitType: false },
  { key: 'muesli',      label: 'Müsli',       iconPath: '/images/muesli1.png',     defaultScope: 'both',     isCustomUnitType: false },
  { key: 'mash',        label: 'Mash',        iconPath: '/images/mash.svg',        defaultScope: 'both',     isCustomUnitType: false },
  { key: 'pellets',     label: 'Pellets',     iconPath: '/images/pellets.svg',     defaultScope: 'both',     isCustomUnitType: false },

  

  { key: 'zusatzfutter',label: 'Zusatzfutter',iconPath: '/images/zusatzfutter.svg',defaultScope: 'feedplan', isCustomUnitType: true  },
  { key: 'medizin',     label: 'Medizin',     iconPath: '/images/medizin.svg',     defaultScope: 'feedplan', isCustomUnitType: true  },
];

const UNIT_OPTIONS: { key: UnitKey; label: string }[] = [
  { key: 'g', label: 'g' },
  { key: 'kg', label: 'kg' },
  { key: 'ml', label: 'ml' },
  { key: 'l', label: 'l' },
  { key: 'anzahl', label: 'Anzahl' },
  { key: 'portion', label: 'Portion' },
  { key: 'schippe', label: 'Schippe' },
  { key: 'becher', label: 'Becher' },
  { key: 'tabletten', label: 'Tabletten' },
];

// Namen, die für die jeweiligen BaseTypes "reserviert" sind (damit du nicht "Hafer" als custom Hafer anlegst)
const RESERVED_STANDARD_NAMES = new Set([
  'hafer',
  'mash',
  'pellets',
  'müsli',
  'muesli',
  'heu',
]);


function normalizeName(s: string): string {
  return (s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue');
}



@Component({
  selector: 'app-futtersorten-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule
  ],
  templateUrl: './futtersorten-dialog.component.html',
  styleUrl: './futtersorten-dialog.component.scss'
})
export class FuttersortenDialogComponent {
baseTypes = BASE_TYPES;
  unitOptions = UNIT_OPTIONS;

  form!: FormGroup<{
    baseType: FormControl<FeedBaseType | null>;
    name: FormControl<string>;
    scope: FormControl<Scope>;
    allowedUnits: FormControl<UnitKey[]>;
  }>;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<FuttersortenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FuttersortenDialogData
  ) {
    const init = data.initial;
    const preset = data.preset;

    const initialBaseType = (init?.baseType ?? preset?.baseType ?? null) as FeedBaseType | null;

    const baseMeta = initialBaseType ? this.baseTypes.find(b => b.key === initialBaseType) : null;

    const initialScope = (init?.scope ?? preset?.scope ?? baseMeta?.defaultScope ?? 'feedplan') as Scope;

    const initialUnits = (init?.allowedUnits ?? preset?.allowedUnits ?? []) as UnitKey[];

    this.form = this.fb.group({
  baseType: this.fb.control<FeedBaseType | null>(initialBaseType, Validators.required),

  name: this.fb.nonNullable.control(
    init?.name ?? preset?.name ?? '',
    [Validators.required, Validators.minLength(2)]
  ),

  // ✅ required + sicherer Default
  scope: this.fb.nonNullable.control<Scope>(
    initialScope ?? 'feedplan',
    { validators: [Validators.required] }
  ),

  allowedUnits: this.fb.nonNullable.control(initialUnits),
});


    // Wenn BaseType geändert wird: Default-Scope setzen + allowedUnits ggf resetten
    this.form.controls.baseType.valueChanges.subscribe(bt => {
  const meta = bt ? this.baseTypes.find(b => b.key === bt) : null;
  if (!meta) return;

  const scopeCtrl = this.form.controls.scope;

  // ✅ Default nur setzen, wenn User noch nichts aktiv gewählt hat
  if (!scopeCtrl.dirty) {
    scopeCtrl.setValue(meta.defaultScope, { emitEvent: false });
  }

  // allowedUnits Logik wie gehabt
  if (!meta.isCustomUnitType) {
    this.form.controls.allowedUnits.setValue([]);
  } else {
    if ((this.form.controls.allowedUnits.value ?? []).length === 0) {
      this.form.controls.allowedUnits.setValue(bt === 'medizin' ? ['ml', 'tabletten'] : ['g', 'ml']);
    }
  }
});


    // Medizin immer nur feedplan
    this.form.controls.scope.valueChanges.subscribe(sc => {
      const bt = this.form.controls.baseType.value;
      if (bt === 'medizin' && sc !== 'feedplan') {
        this.form.controls.scope.setValue('feedplan');
      }
    });

    if (this.isReadOnly) {
  this.form.disable({ emitEvent: false });
}

  }

  get isReadOnly(): boolean {
  return this.data.mode === 'edit' && !!this.data.initial?.isDefault;
}


  get title(): string {
    return this.data.mode === 'edit' ? 'Futtersorte bearbeiten' : 'Futtersorte anlegen';
  }

  get selectedBaseTypeMeta(): BaseTypeOption | null {
    const bt = this.form.controls.baseType.value;
    return bt ? this.baseTypes.find(b => b.key === bt) ?? null : null;
  }

  get showUnits(): boolean {
    return this.selectedBaseTypeMeta?.isCustomUnitType ?? false;
  }

  get scopeDisabled(): boolean {
    // Medizin darf nicht in Kraftfutter auftauchen
    return this.form.controls.baseType.value === 'medizin';
  }

  cancel() {
    this.ref.close();
  }

  remove() {
    // Standard-Items dürfen nicht gelöscht werden (falls jemand es trotzdem im Dialog öffnet)
    if (this.data.initial?.isDefault) return;
    this.ref.close({ delete: true });
  }

  private validateReservedName(name: string): string | null {
  const n = normalizeName(name);
  if (RESERVED_STANDARD_NAMES.has(n)) {
    return `„${name}“ ist bereits als Standardname vorhanden. Bitte einen speziellen Namen wählen (z.B. „Gequetschter ${name}“).`;
  }
  return null;
}


  save() {
    if (this.form.invalid) return;

    const baseType = this.form.controls.baseType.value!;
    const name = this.form.controls.name.value.trim();
    const scope = this.form.controls.scope.value;
    const allowedUnits = this.form.controls.allowedUnits.value ?? [];

    const reservedError = this.validateReservedName(name);
if (reservedError) {
  this.form.controls.name.setErrors({ reserved: true });
  return;
}


    const meta = this.baseTypes.find(b => b.key === baseType)!;

    const result: FeedDefinition = {
  ...(this.data.initial?._id ? { _id: this.data.initial._id, _rev: this.data.initial._rev } : {}),
  docType: 'feed_definition',
  stallId: this.data.initial?.stallId ?? '', // wird bei ADD eh rausgestrippt
  baseType,
  name,
  scope: baseType === 'medizin' ? 'feedplan' : scope,
  allowedUnits: meta.isCustomUnitType ? allowedUnits : undefined,
  isDefault: this.data.initial?.isDefault ?? false
};




    this.ref.close(result);
  }

  // Für Save-Button
  isSaveDisabled(): boolean {
    if (this.form.invalid) return true;

    const bt = this.form.controls.baseType.value;
    if (!bt) return true;

    const meta = this.selectedBaseTypeMeta;
    if (meta?.isCustomUnitType) {
      return (this.form.controls.allowedUnits.value ?? []).length === 0;
    }
    return false;
  }
}