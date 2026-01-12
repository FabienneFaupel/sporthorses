export function toDateOnlyIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromDateOnlyIsoLocal(iso: string): Date {
  return new Date(iso + 'T00:00:00');
}
