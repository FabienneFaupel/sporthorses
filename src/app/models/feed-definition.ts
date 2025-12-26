export type FeedBaseType =
  | 'hafer' | 'muesli' | 'mash' | 'pellets'
  | 'heu'
  | 'zusatzfutter' | 'medizin';

export type FeedScope = 'both' | 'feedplan';

export type UnitKey =
  | 'schippe' | 'becher' | 'portion' | 'anzahl'
  | 'g' | 'kg' | 'ml' | 'l'
  | 'tabletten';

export interface FeedDefinition {
  // CouchDB Meta
  _id?: string;
  _rev?: string;

  docType: 'feed_definition';
  stallId: string;

  baseType: FeedBaseType;
  name: string;
  scope: FeedScope;
  allowedUnits?: UnitKey[];

  isDefault?: boolean;

  createdAt?: string;
  updatedAt?: string;
}
