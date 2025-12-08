// src/app/models/kraftfutter.ts
export type KraftfutterType = 'hafer' | 'muesli' | 'zusatz';
export type PackageType = 'bigbag' | 'sack';

export interface KraftfutterDelivery {
  _id?: string;
  _rev?: string;
  docType: 'kraftfutter';
  product: KraftfutterType;
  date: string;   // ISO yyyy-mm-dd
  packageType: PackageType;
  weightKg?: number;     // wenn BigBag
  sackWeightKg?: number; // wenn Sack
  count?: number;        // wenn Sack
  priceEuro?: number;
  supplier?: string;
  note?: string;

  createdAt?: string;
  updatedAt?: string;
}
