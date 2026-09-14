import { describe, expect, it } from "vitest";
import { applySchema, registerEmployerSchema } from "./validation";
import { parseSearch } from "./search-params";
import { makeValidIco } from "./ico";

describe("applySchema", () => {
  it("requires name, phone and GDPR consent", () => {
    const parsed = applySchema.safeParse({
      jobId: "11111111-1111-4111-8111-111111111111",
      fullName: "Jan Novák",
      phone: "+420 777 123 456",
      consentGdpr: true,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.phone).toBe("+420777123456");
  });

  it("rejects missing consent", () => {
    const parsed = applySchema.safeParse({
      jobId: "11111111-1111-4111-8111-111111111111",
      fullName: "Jan Novák",
      phone: "777123456",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("registerEmployerSchema", () => {
  const ico = makeValidIco("2691930");

  it("splits first and last name and stores a combined display name", () => {
    const parsed = registerEmployerSchema.safeParse({
      email: "jan@kovovyroba.test",
      firstName: "Jan",
      lastName: "Novák",
      companyName: "Kovovýroba Novák",
      ico,
      dic: "cz" + ico,
      city: "Ostrava",
      phone: "+420 777 123 456",
      consentTerms: "on",
    });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.firstName).toBe("Jan");
    expect(parsed.data.lastName).toBe("Novák");
    expect(parsed.data.name).toBe("Jan Novák");
    expect(parsed.data.dic).toBe(`CZ${ico}`);
    expect(parsed.data.phone).toBe("+420777123456");
  });

  it("rejects a single combined name field", () => {
    const parsed = registerEmployerSchema.safeParse({
      email: "jan@kovovyroba.test",
      name: "Jan Novák",
      companyName: "Kovovýroba Novák",
      ico,
      phone: "777123456",
      consentTerms: true,
    });
    expect(parsed.success).toBe(false);
  });

  it("allows empty DIČ", () => {
    const parsed = registerEmployerSchema.safeParse({
      email: "jan@kovovyroba.test",
      firstName: "Jan",
      lastName: "Novák",
      companyName: "Kovovýroba Novák",
      ico,
      phone: "777123456",
      consentTerms: true,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.dic).toBeUndefined();
  });
});

describe("parseSearch", () => {
  it("keeps profession and city filters", () => {
    expect(parseSearch({ profession: "welder", city: "Ostrava", sort: "salary" })).toEqual({
      profession: "welder",
      city: "Ostrava",
      sort: "salary",
    });
  });

  it("drops unknown profession instead of throwing", () => {
    expect(parseSearch({ profession: "astronaut" })).toEqual({ sort: "newest" });
  });
});
