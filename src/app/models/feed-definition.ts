export type FeedBaseType = 'hafer' | 'heu' | 'mash' | 'pellets' | 'muesli' | 'zusatzfutter' | 'medizin';

export type FeedScope = 'both' | 'feedplan';

export type UnitKey =
  | 'schippe'
  | 'becher'
  | 'portion'
  | 'anzahl'
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'tabletten';

export interface FeedDefinition {
  id: string;               // nur frontend v1
  baseType: FeedBaseType;   // bestimmt Icon + Logik
  name: string;             // "Gequetschter Hafer", "Magnesium", ...
  scope: FeedScope;         // medizin => feedplan
  allowedUnits?: UnitKey[]; // nur für zusatzfutter/medizin
  isDefault?: boolean;      // defaults nicht löschbar
}
