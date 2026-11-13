import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { stylists } from "@/data/stylists";
import { canStylistDo } from "@/lib/bookingDraft";

describe("catalogue", () => {
  it("has unique service ids and every category has services", () => {
    expect(new Set(services.map((item) => item.id)).size).toBe(services.length);
    for (const category of categories) expect(services.some((item) => item.categoryId === category.id)).toBe(true);
  });
  it("has at least one stylist for every service", () => {
    for (const item of services) expect(stylists.some((stylist) => canStylistDo(stylist, [item]))).toBe(true);
  });
});
