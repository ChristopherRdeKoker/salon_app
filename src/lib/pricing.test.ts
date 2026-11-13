import { describe, expect, it } from "vitest";
import { breakDownPrice, formatRand, formatWholeRand } from "@/lib/pricing";

describe("breakDownPrice", () => {
  it("adds two services and takes 15% VAT out of the VAT-inclusive total", () => {
    const price = breakDownPrice([
      { label: "Gel overlay, hands", priceCents: 38000 },
      { label: "Brow wax", priceCents: 9500 },
    ]);
    expect(price.totalCents).toBe(47500);
    expect(price.vatCents).toBe(6196);
    expect(price.exVatCents).toBe(41304);
  });
  it("rounds VAT to the nearest cent on R100", () => {
    const price = breakDownPrice([{ label: "x", priceCents: 10000 }]);
    expect(price.vatCents).toBe(1304);
    expect(price.exVatCents).toBe(8696);
  });
  it("handles a zero-priced line", () => {
    expect(breakDownPrice([{ label: "free", priceCents: 0 }])).toMatchObject({ totalCents: 0, vatCents: 0, exVatCents: 0 });
  });
  it("handles a large total", () => {
    const price = breakDownPrice([{ label: "big", priceCents: 1234567 }]);
    expect(price.vatCents).toBe(161030);
    expect(price.exVatCents).toBe(1073537);
  });
  it("refuses negative, fractional or missing lines", () => {
    expect(() => breakDownPrice([{ label: "neg", priceCents: -1 }])).toThrow(RangeError);
    expect(() => breakDownPrice([{ label: "half", priceCents: 10.5 }])).toThrow(RangeError);
    expect(() => breakDownPrice([])).toThrow(RangeError);
  });
});

describe("formatting rand", () => {
  it("formats cents in the South African style", () => {
    expect(formatRand(47500).replace(/\s/g, " ")).toBe("R 475,00");
    expect(formatWholeRand(38000).replace(/\s/g, " ")).toBe("R 380");
    expect(formatWholeRand(38050).replace(/\s/g, " ")).toBe("R 380,50");
  });
});
