import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/schemas/contactSchema";

const valid = { name: "Test Person", phone: "082 000 0000", email: "test@example.com", note: "", agree: true };

describe("contactSchema phone", () => {
  it.each([
    ["082 000 0000", "+27820000000"],
    ["0820000000", "+27820000000"],
    ["+27 82 000 0000", "+27820000000"],
    ["+27-31-000-0000", "+27310000000"],
    ["(031) 000 0000", "+27310000000"],
  ])("accepts %s as %s", (input, normalised) => {
    const parsed = contactSchema.safeParse({ ...valid, phone: input });
    expect(parsed.success && parsed.data.phone).toBe(normalised);
  });
  it.each(["", "082 000 000", "082 000 00000", "+270820000000", "+44 20 0000 0000", "0020000000", "082 ABC 0000", "0920000000"])("rejects %j", (input) => {
    expect(contactSchema.safeParse({ ...valid, phone: input }).success).toBe(false);
  });
});

describe("contactSchema other fields", () => {
  it("trims the name and requires two characters", () => {
    expect(contactSchema.safeParse({ ...valid, name: "  A " }).success).toBe(false);
    const parsed = contactSchema.safeParse({ ...valid, name: "  Lee  " });
    expect(parsed.success && parsed.data.name).toBe("Lee");
  });
  it("rejects a bad email, a long note and an unticked demo box", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, note: "x".repeat(301) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, agree: false }).success).toBe(false);
  });
});
