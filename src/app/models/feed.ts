// src/app/models/feed.ts

export type FeedType = 'heu' | 'stroh';
export type FeedAction = 'add' | 'consume';

export interface FeedLogEntry {
  _id?: string;   // CouchDB
  _rev?: string;  // CouchDB

  date: Date;           // in TS als Date
  type: FeedType;       // 'heu' | 'stroh'
  action: FeedAction;   // 'add' | 'consume'
  amount: number;
  price?: number;

  createdAt?: string;   // ISO-String
  updatedAt?: string;   // ISO-String
}
