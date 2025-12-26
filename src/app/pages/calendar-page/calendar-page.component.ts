import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';


type EventType = 'schmied' | 'tierarzt' | 'training' | 'turnier' | 'sonstiges';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  type: EventType;
  note?: string;
}

@Component({
  selector: 'app-calendar-page',
  imports: [
    CommonModule,          // *ngIf, *ngFor, date-Pipe
    MatDatepickerModule,   // enthält <mat-calendar>
    MatNativeDateModule,   // DateAdapter für Datepicker/Calendar
    MatIconModule 
  ],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent {
  selectedDate: Date = this.stripTime(new Date());

  private events: CalendarEvent[] = [
    {
      id: crypto.randomUUID(),
      title: 'Schmied: Check Point Charly',
      date: this.stripTime(new Date()),
      time: '10:00',
      type: 'schmied',
      note: 'Hufe vorne prüfen',
    },
    {
      id: crypto.randomUUID(),
      title: 'Training: Dressur',
      date: this.stripTime(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      time: '18:00',
      type: 'training',
    },
  ];

  get dayEvents(): CalendarEvent[] {
    const key = this.dateKey(this.selectedDate);
    return this.events
      .filter(e => this.dateKey(e.date) === key)
      .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
  }

  onDateChanged(d: Date | null) {
    if (!d) return;
    this.selectedDate = this.stripTime(d);
  }

  deleteEvent(id: string) {
    this.events = this.events.filter(e => e.id !== id);
  }

  private stripTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private dateKey(d: Date): string {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }

  labelForType(t: EventType): string {
    switch (t) {
      case 'schmied': return 'Schmied';
      case 'tierarzt': return 'Tierarzt';
      case 'training': return 'Training';
      case 'turnier': return 'Turnier';
      default: return 'Sonstiges';
    }
  }

  iconForType(t: EventType): string {
    switch (t) {
      case 'schmied': return 'build';
      case 'tierarzt': return 'medical_services';
      case 'training': return 'fitness_center';
      case 'turnier': return 'emoji_events';
      default: return 'event';
    }
  }
}