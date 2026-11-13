import { formatRand, type PriceBreakdownType } from "@/lib/pricing";

export function PriceBreakdown({ price }: { price: PriceBreakdownType }) {
  return (
    <dl className="price-breakdown" data-testid="price-breakdown">
      {price.lines.map((line) => (
        <div key={line.label} className="price-line">
          <dt>{line.label}</dt>
          <dd>{formatRand(line.priceCents)}</dd>
        </div>
      ))}
      <div className="price-line price-line-quiet">
        <dt>Excluding VAT</dt>
        <dd>{formatRand(price.exVatCents)}</dd>
      </div>
      <div className="price-line price-line-quiet">
        <dt>VAT at 15%</dt>
        <dd data-testid="price-vat">{formatRand(price.vatCents)}</dd>
      </div>
      <div className="price-line price-total">
        <dt>Total</dt>
        <dd data-testid="price-total">{formatRand(price.totalCents)}</dd>
      </div>
    </dl>
  );
}
