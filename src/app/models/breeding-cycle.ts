export type VetStatus = 'geplant' | 'fällig' | 'erledigt' | 'ausgefallen';

export interface VetAppointment {
  id: string;
  type: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  vet: string;
  status: VetStatus;
  result?: string;
  resultText?: string;
  note?: string;
  stallion?: string;
}

export interface HeatCycle {
  id: string;
  startDate: string;
  endDate: string;
  intensity: 'leicht' | 'normal' | 'stark';
  note: string;
}

export interface InseminationOrder {
  id: string;
  stallion: string;
  semenType: 'Frischsamen' | 'Kühlsamen' | 'TG-Samen';
  orderDate: string;
  orderTime: string;
  stallionStation: string;
  inseminationDate: string;
  inseminationTime: string;
  vet: string;
  location: string;
  hasAppointment?: boolean;
}

export interface BreedingCycle {
  _id?: string;
  _rev?: string;
  docType: 'breeding_cycle';
  stallId: string;
  horseId: string;

  year: number;
  stallion: string;
  status: 'aktiv' | 'fohlen geboren' | 'nicht tragend';

  heatCycles: HeatCycle[];
  inseminationOrders: InseminationOrder[];
  vetAppointments: VetAppointment[];

  cycleSettings: {
    heatCycleDays: number;
    pregnancyDays: number;
  };

  createdAt?: string;
  updatedAt?: string;
}