export interface VaccinationSchedule {
  _id?: string;
  _rev?: string;

  docType: 'vaccination_schedule';
  stallId: string;

  /** fälliger Monat, z.B. "2026-06" */
  dueMonth: string;

  /** optional: konkreter Termin, wenn bekannt */
  nextVisitDate?: string; // ISO YYYY-MM-DD

  intervalMonths: number;     // default 6
  remindDaysBefore: number;   // z.B. 14

  createdAt?: string;
  updatedAt?: string;
}
