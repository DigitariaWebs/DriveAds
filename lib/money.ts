// Centralised cents → euros formatter. Backend stores all monetary values
// as integer cents; UI divides by 100 at render time only.
export function formatEur(
  cents: number | null | undefined,
  opts: { withSign?: boolean } = {},
): string {
  const v = (cents ?? 0) / 100;
  const formatted = v.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  if (opts.withSign && v > 0) return `+${formatted} €`;
  return `${formatted} €`;
}

export function eurToCents(input: string): number {
  const cleaned = input.replace(/\s/g, '').replace(',', '.');
  const v = parseFloat(cleaned);
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.round(v * 100);
}
