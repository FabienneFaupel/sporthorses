export interface Vaccination {
  type: string;
  date: string;   // ISO YYYY-MM-DD
  next?: string;   // ISO YYYY-MM-DD
  status: string;
}

export type HoofAction = 'ausgeschnitten' | 'beschlagen-alt' | 'beschlagen-neu';

export interface Hoof {
  position: 'VL' | 'VR' | 'HL' | 'HR';
  action: HoofAction;
}

export interface FarrierEntry {
  date: string; // ISO YYYY-MM-DD
  type: string;
  comment?: string;
  hooves: Hoof[];
}

export interface Pedigree {
  father?: string;
  mother?: string;
  motherFather?: string;
  grandfather?: string;
  grandmother?: string;
}

export interface Horse {
  _id?: string;   // CouchDB
  _rev?: string;  // CouchDB
  docType: 'horse';
  name: string;
  breed: string;
  age: number;
  birth: string;    // ISO YYYY-MM-DD
  gender: string;
  vaccinations: Vaccination[];
  farrierEntries: FarrierEntry[];
  pedigree?: Pedigree;
  createdAt?: string;
  updatedAt?: string;
}
