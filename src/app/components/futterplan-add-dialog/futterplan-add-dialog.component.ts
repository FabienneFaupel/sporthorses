import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { FeedDefinition } from '../../models/feed-definition';
import { FeedPlanItem, Slot, PlanBaseType } from '../../models/feed-plan';
import type { UnitKey } from '../../models/feed-definition';

export interface DialogData {
  horseName: string;
  slot: Slot;
  mode?: 'add' | 'edit';
  initial?: FeedPlanItem;
  feedDefs: FeedDefinition[];
}

interface PresetOption {
  value: string;
  label: string;
}
interface UnitOption {
  key: UnitKey;
  label: string;
  mode: 'preset' | 'number';
  presets?: PresetOption[];
  step?: number;
  min?: number;
  hint?: string;
}

interface ProductOption {
  id: string;                 // ✅ eindeutig: def._id oder 'heu'
  baseType: PlanBaseType;      // ✅ hafer/muesli/.../heu/zusatzfutter/medizin
  label: string;
  iconPath: string;
  feedDefId?: string;          // ✅ bei 'heu' undefined
  allowedUnits?: UnitKey[];
}

// Presets
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

const UNITS_BY_BASETYPE: Record<PlanBaseType, UnitOption[]> = {
  hafer: [
    { key: 'schippe', label: 'Schippe', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Schippe ≈ 500 g' },
    { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 },
  ],
  heu: [
    { key: 'portion', label: 'Portion', mode: 'preset', presets: HAY_PORTION_PRESETS },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.5, min: 0 },
  ],
  mash: [
    { key: 'schippe', label: 'Schippe', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Schippe ≈ 1000 g' },
    { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 },
    { key: 'ml', label: 'ml', mode: 'number', step: 50, min: 0 },
    { key: 'l', label: 'l', mode: 'number', step: 0.1, min: 0 },
  ],
  pellets: [
    { key: 'schippe', label: 'Schippe', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Schippe ≈ 500 g' },
    { key: 'becher', label: 'Becher', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Becher ≈ 250 ml' },
    { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 },
  ],
  muesli: [
    { key: 'schippe', label: 'Schippe', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Schippe ≈ 500 g' },
    { key: 'becher', label: 'Becher', mode: 'preset', presets: FRACTION_PRESETS, hint: 'Richtwert: 1 Becher ≈ 250 ml' },
    { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 },
  ],
  zusatzfutter: [
    { key: 'g', label: 'g', mode: 'number', step: 10, min: 0 },
    { key: 'kg', label: 'kg', mode: 'number', step: 0.1, min: 0 },
    { key: 'ml', label: 'ml', mode: 'number', step: 10, min: 0 },
    { key: 'l', label: 'l', mode: 'number', step: 0.1, min: 0 },
    { key: 'anzahl', label: 'Anzahl', mode: 'number', step: 1, min: 0 },
  ],
  medizin: [
    { key: 'ml', label: 'ml', mode: 'number', step: 1, min: 0 },
    { key: 'tabletten', label: 'Tabletten', mode: 'number', step: 1, min: 0 },
  ],
};



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
  products: ProductOption[] = [];

  form!: FormGroup<{
    productId: FormControl<string | null>;  // ✅ neu
    unitKey: FormControl<UnitKey | null>;
    preset: FormControl<string | null>;
    amountNum: FormControl<number | null>;
  }>;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<FutterplanAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    const fromDefs: ProductOption[] = (data.feedDefs ?? [])
      .filter(d => d.scope === 'feedplan' || d.scope === 'both')
      .map(d => ({
        id: d._id!, // ✅ eindeutig
        baseType: d.baseType as PlanBaseType,
        label: d.name,
        iconPath: this.iconFor(d.baseType),
        feedDefId: d._id,
        allowedUnits: d.allowedUnits as any
      }));

    const hay: ProductOption = {
      id: 'heu',
      baseType: 'heu',
      label: 'Heu',
      iconPath: '/images/heu.svg'
    };

    this.products = [hay, ...fromDefs];

    this.form = this.fb.group({
      productId: this.fb.control<string | null>(null, Validators.required),
      unitKey: this.fb.control<UnitKey | null>(null, Validators.required),
      preset: this.fb.control<string | null>(null),
      amountNum: this.fb.control<number | null>(null),
    });

    // Produktwechsel
    this.form.controls.productId.valueChanges.subscribe(() => {
      this.form.controls.unitKey.setValue(null);
      this.form.controls.preset.setValue(null);
      this.form.controls.amountNum.setValue(null);
    });

    // Unitwechsel
    this.form.controls.unitKey.valueChanges.subscribe(() => {
      this.form.controls.preset.setValue(null);
      this.form.controls.amountNum.setValue(null);
    });

    // ✅ Edit vorausfüllen
    if (data.mode === 'edit' && data.initial) {
      const init = data.initial;

      const pid = init.feedDefId ?? (init.baseType === 'heu' ? 'heu' : null);
      this.form.controls.productId.setValue(pid);

      this.form.controls.unitKey.setValue(init.unitKey);

      if (init.preset) this.form.controls.preset.setValue(init.preset);
      if (init.amountNum != null) this.form.controls.amountNum.setValue(init.amountNum);
    }
  }

  private iconFor(baseType: string): string {
    switch (baseType) {
      case 'hafer': return '/images/hafer.svg';
      case 'mash': return '/images/mash.svg';
      case 'pellets': return '/images/pellets.svg';
      case 'muesli': return '/images/muesli1.png';
      case 'zusatzfutter': return '/images/zusatzfutter.png';
      case 'medizin': return '/images/medizin.svg';
      case 'heu': return '/images/heu.svg';
      default: return '/images/default.svg';
    }
  }

  get selectedProduct(): ProductOption | null {
    const id = this.form.controls.productId.value;
    if (!id) return null;
    return this.products.find(p => p.id === id) ?? null;
  }

  get unitOptions(): UnitOption[] {
    const p = this.selectedProduct;
    if (!p) return [];

    const all = UNITS_BY_BASETYPE[p.baseType] ?? [];

    // nur bei Zusatzfutter/Medizin einschränken
    const restrictable = p.baseType === 'zusatzfutter' || p.baseType === 'medizin';
    if (!restrictable) return all;

    if (!p.allowedUnits || p.allowedUnits.length === 0) return all;
    return all.filter(u => (p.allowedUnits as any).includes(u.key));
  }

  get selectedUnit(): UnitOption | null {
    const uk = this.form.controls.unitKey.value;
    return uk ? (this.unitOptions.find(u => u.key === uk) ?? null) : null;
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

      const isFraction = pr.includes('/') || pr === '1';
      amountText = isFraction ? `${pr} ${u.label}` : pr;
    } else {
      const n = this.form.controls.amountNum.value;
      if (n == null) return;
      amountText = `${n} ${u.label}`;
    }

    const result: FeedPlanItem = {
      feedDefId: p.feedDefId,        // ✅ undefined bei Heu
      baseType: p.baseType,          // ✅ korrekt
      name: p.label,
      amount: amountText,
      icon: p.iconPath,
      unitKey: u.key,
      preset: u.mode === 'preset' ? (this.form.controls.preset.value ?? undefined) : undefined,
      amountNum: u.mode === 'number' ? (this.form.controls.amountNum.value ?? undefined) : undefined
    };

    this.ref.close(result);
  }

  isSaveDisabled(): boolean {
    if (this.form.invalid) return true;
    const u = this.selectedUnit;
    if (!u) return true;

    if (u.mode === 'preset') return !this.form.controls.preset.value;
    return this.form.controls.amountNum.value == null;
  }

  remove() {
    this.ref.close({ delete: true });
  }
}