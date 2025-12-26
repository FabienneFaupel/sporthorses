// kraftfutter.ts
import { FeedBaseType } from './feed-definition';
export type PackageType = 'bigbag' | 'sack';

export interface KraftfutterDelivery {
  _id?: string;
  _rev?: string;
  docType: 'kraftfutter';

  // ❌ product raus
  // product: KraftfutterType;

  date: string;

  feedDefId: string;        // ✅ Referenz
  baseType: FeedBaseType;   // ✅ hafer/muesli/mash/pellets
  name: string;             // ✅ Anzeige im UI

  packageType: PackageType;
  weightKg?: number;
  sackWeightKg?: number;
  count?: number;
  priceEuro?: number;
  supplier?: string;
  note?: string;

  createdAt?: string;
  updatedAt?: string;
}
