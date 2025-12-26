import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export type Slot = 'Morgens' | 'Mittags' | 'Abends';

export interface FeedItem {
  product: string;
  amount: string;  // z.B. "1/2 Schippe" oder "250 g"
  icon: string;    // Pfad zu SVG ("/images/hafer.svg")
}

type ProductKey = 'hafer' | 'heu' | 'mash' | 'pellets' | 'muesli';
type UnitKey = 'schippe' | 'becher' | 'portion' | 'anzahl' | 'g' | 'kg' | 'ml' | 'l';

interface PresetOption {
  value: string;   // was gespeichert wird, z.B. "1/2"
  label: string;   // Anzeige, z.B. "½"
}

interface UnitOption {
  key: UnitKey;
  label: string;                 // "Schippe", "g", "kg", ...
  mode: 'preset' | 'number';     // preset = Auswahl 1/4, 1/2,... / number = Zahlenfeld
  presets?: PresetOption[];      // nur bei preset
  step?: number;                 // optional für number input
  min?: number;
  hint?: string;
}

interface ProductOption {
  key: ProductKey;
  label: string;
  iconPath: string;              // "/images/hafer.svg"
  units: UnitOption[];
}

// Presets für "Behälter-Einheiten"
const FRACTION_PRESETS: PresetOption[] = [
  { value: '1/4', label: '¼' },
  { value: '1/2', label: '½' },
  { value: '3/4', label: '¾' },
  { value: '1',   label: '1' },
];

const HAY_PORTION_PRESETS: PresetOption[] = [
  { value: 'Handvoll', label: 'Handvoll' },
  { value: 'Kleine Portion', label: 'Kleine Portion' },
  { value: 'Normale Portion', label: 'Normale Portion' },
  { value: 'Große Portion', label: 'Große Portion' },
];


const PRODUCTS: ProductOption[] = [
  {
    key: 'hafer',
    label: 'Hafer',
    iconPath: '/images/hafer.svg',
    units: [
      { key: 'schippe', label: 'Schippe', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Schippe ≈ 500 g ' },
      { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
      { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 }
    ]
  },
  {
  key: 'heu',
  label: 'Heu',
  iconPath: '/images/heu.svg',
  units: [
    { key: 'portion', label: 'Portion', mode: 'preset', presets: HAY_PORTION_PRESETS },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.5, min: 0 }
  ]
},

  {
  key: 'mash',
  label: 'Mash',
  iconPath: '/images/mash.svg',
  units: [
    { key: 'schippe', label: 'Schippe', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Schippe ≈ 1000 g ' },
    { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 },
    { key: 'ml', label: 'ml', mode: 'number', step: 50, min: 0 },
    { key: 'l', label: 'l', mode: 'number', step: 0.1, min: 0 }
  ]
},

  {
  key: 'pellets',
  label: 'Pellets',
  iconPath: '/images/pellets.svg',
  units: [
    { key: 'schippe', label: 'Schippe', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Schippe ≈ 500 g ' },
    { key: 'becher', label: 'Becher', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Becher ≈ 250 ml ' },
    { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 }
  ]
},

  {
  key: 'muesli',
  label: 'Müsli',
  iconPath: '/images/muesli1.png',
  units: [
    { key: 'schippe', label: 'Schippe', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Schippe ≈ 500 g ' },
    { key: 'becher', label: 'Becher', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Becher ≈ 250 ml ' },
    { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 }
  ]
},

];


@Component({
  selector: 'app-futterplan-add-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './futterplan-add-dialog.component.html',
  styleUrl: './futterplan-add-dialog.component.scss'
})

export class FutterplanAddDialogComponent {
  products = PRODUCTS;

  form!: FormGroup<{
    productKey: FormControl<ProductKey | null>;
    unitKey: FormControl<UnitKey | null>;
    preset: FormControl<string | null>;     // z.B. "1/2"
    amountNum: FormControl<number | null>;  // z.B. 250
  }>;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<FutterplanAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { horseName: string; slot: Slot }
  ) {
    this.form = this.fb.group({
      productKey: this.fb.control<ProductKey | null>(null, Validators.required),
      unitKey: this.fb.control<UnitKey | null>(null, Validators.required),
      preset: this.fb.control<string | null>(null),
      amountNum: this.fb.control<number | null>(null),
    });

    // Wenn Produkt gewechselt wird: Unit zurücksetzen + Menge reset
    this.form.controls.productKey.valueChanges.subscribe(() => {
      this.form.controls.unitKey.setValue(null);
      this.form.controls.preset.setValue(null);
      this.form.controls.amountNum.setValue(null);
    });

    // Wenn Unit gewechselt wird: passende Eingabe aktivieren
    this.form.controls.unitKey.valueChanges.subscribe(() => {
      this.form.controls.preset.setValue(null);
      this.form.controls.amountNum.setValue(null);
    });
  }

  get selectedProduct(): ProductOption | null {
    const key = this.form.controls.productKey.value;
    return key ? this.products.find(p => p.key === key) ?? null : null;
  }

  get selectedUnit(): UnitOption | null {
    const uk = this.form.controls.unitKey.value;
    const p = this.selectedProduct;
    if (!uk || !p) return null;
    return p.units.find(u => u.key === uk) ?? null;
  }

  get amountMode(): 'preset' | 'number' | null {
    return this.selectedUnit?.mode ?? null;
  }

  get unitLabel(): string {
    return this.selectedUnit?.label ?? '';
  }

  cancel() {
    this.ref.close();
  }

  save() {
    if (this.form.invalid) return;

    const p = this.selectedProduct;
    const u = this.selectedUnit;
    if (!p || !u) return;

    let amountText = '';

    if (u.mode === 'preset') {
  const pr = this.form.controls.preset.value;
  if (!pr) return;

  // Wenn preset wie "1/2" aussieht -> Einheit anhängen
  // Wenn preset Text ist ("Handvoll") -> 그대로 speichern
  const isFraction = pr.includes('/') || pr === '1';

  amountText = isFraction ? `${pr} ${u.label}` : pr;
}
 else {
      const n = this.form.controls.amountNum.value;
      if (n == null) return;
      // z.B. "250 g"
      amountText = `${n} ${u.label}`;
    }

    const result: FeedItem = {
      product: p.label,
      amount: amountText,
      icon: p.iconPath
    };

    this.ref.close(result);
  }

  // Für Button-Disable im Template
  isSaveDisabled(): boolean {
    if (this.form.invalid) return true;
    const u = this.selectedUnit;
    if (!u) return true;

    if (u.mode === 'preset') return !this.form.controls.preset.value;
    return this.form.controls.amountNum.value == null;
  }
}