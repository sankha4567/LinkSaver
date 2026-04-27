import { describe, it, expect } from "vitest";
import { linkSchema } from "@/lib/validations";

describe("linkSchema", () => {
  const valid = {
    title: "MDN",
    url: "https://developer.mozilla.org",
    note: "",
  };

  it("accepts http and https URLs", () => {
    expect(linkSchema.safeParse(valid).success).toBe(true);
    expect(
      linkSchema.safeParse({ ...valid, url: "http://example.com" }).success,
    ).toBe(true);
  });

  it("rejects URLs without an http(s) scheme", () => {
    const ftp = linkSchema.safeParse({ ...valid, url: "ftp://example.com" });
    expect(ftp.success).toBe(false);

    const javascriptScheme = linkSchema.safeParse({
      ...valid,
      url: "javascript:alert(1)",
    });
    expect(javascriptScheme.success).toBe(false);
  });

  it("rejects malformed URLs with the friendly message", () => {
    const r = linkSchema.safeParse({ ...valid, url: "not a url" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(
        r.error.issues.some((i) =>
          /please enter a valid url/i.test(i.message),
        ),
      ).toBe(true);
    }
  });

  it("rejects an empty title", () => {
    const r = linkSchema.safeParse({ ...valid, title: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(
        r.error.issues.some(
          (i) => i.path[0] === "title" && /required/i.test(i.message),
        ),
      ).toBe(true);
    }
  });

  it("rejects notes longer than 500 characters", () => {
    const r = linkSchema.safeParse({ ...valid, note: "a".repeat(501) });
    expect(r.success).toBe(false);
  });

  it("accepts a 500-character note (boundary)", () => {
    expect(
      linkSchema.safeParse({ ...valid, note: "a".repeat(500) }).success,
    ).toBe(true);
  });

  it("accepts an empty-string note", () => {
    expect(linkSchema.safeParse({ ...valid, note: "" }).success).toBe(true);
  });
});
