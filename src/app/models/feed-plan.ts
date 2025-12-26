export type Slot = 'Morgens' | 'Mittags' | 'Abends';

export type ProductKey = 'hafer' | 'heu' | 'mash' | 'pellets' | 'muesli';
export type UnitKey = 'schippe' | 'becher' | 'portion' | 'anzahl' | 'g' | 'kg' | 'ml' | 'l';

export interface FeedPlanItem {
  // Anzeige
  product: string;
  amount: string;
  icon: string;

  // Rohdaten für Edit
  productKey: ProductKey;
  unitKey: UnitKey;
  preset?: string;
  amountNum?: number;
}

export type FeedPlan = Record<Slot, FeedPlanItem[]>;
