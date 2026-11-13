export const VAT_RATE_PERCENT = 15;

export type PriceBreakdownType = {
  lines: { label: string; priceCents: number }[];
  totalCents: number;
  vatCents: number;
  exVatCents: number;
};

export function breakDownPrice(lines: { label: string; priceCents: number }[]): PriceBreakdownType {
  for (const line of lines) {
    if (!Number.isSafeInteger(line.priceCents) || line.priceCents < 0) throw new RangeError(`Price for ${line.label} must be whole non-negative cents, got ${line.priceCents}`);
  }
  if (!lines.length) throw new RangeError("A price breakdown needs at least one service");

  const totalCents = lines.reduce((sum, line) => sum + line.priceCents, 0);
  const vatCents = Math.round((totalCents * VAT_RATE_PERCENT) / (100 + VAT_RATE_PERCENT));
  const result = { lines, totalCents, vatCents, exVatCents: totalCents - vatCents };

  return result;
}

const randFormatter = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const wholeRandFormatter = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0, maximumFractionDigits: 0 });

export function formatRand(cents: number): string {
  const result = randFormatter.format(cents / 100);

  return result;
}

export function formatWholeRand(cents: number): string {
  const isWhole = cents % 100 === 0;
  const result = isWhole ? wholeRandFormatter.format(cents / 100) : formatRand(cents);

  return result;
}
