/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

const modules = import.meta.glob("./**/!(*.test).*s");

function setup() {
  const t = convexTest(schema, modules);
  const userA = t.withIdentity({ subject: "user_a" });
  const userB = t.withIdentity({ subject: "user_b" });
  return { t, userA, userB };
}

describe("createLink", () => {
  test("rejects unauthenticated callers", async () => {
    const { t } = setup();
    await expect(
      t.mutation(api.links.createLink, {
        title: "x",
        url: "https://x.com",
        note: "",
      }),
    ).rejects.toThrow(/unauthorized/i);
  });

  test("inserts a link with the caller's user id and a timestamp", async () => {
    const { t, userA } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "MDN",
      url: "https://developer.mozilla.org",
      note: "docs",
    });

    const stored = await t.run(async (ctx) => ctx.db.get(linkId));
    expect(stored).toMatchObject({
      title: "MDN",
      url: "https://developer.mozilla.org",
      note: "docs",
      userId: "user_a",
    });
    expect(typeof stored?.createdAt).toBe("number");
  });
});

describe("getAllLinks", () => {
  test("returns [] for unauthenticated callers", async () => {
    const { t } = setup();
    const links = await t.query(api.links.getAllLinks, {});
    expect(links).toEqual([]);
  });

  test("returns only the caller's own links, newest first", async () => {
    const { userA, userB } = setup();
    await userB.mutation(api.links.createLink, {
      title: "B link",
      url: "https://b.example",
      note: "",
    });
    await userA.mutation(api.links.createLink, {
      title: "A1",
      url: "https://a1.example",
      note: "",
    });
    await userA.mutation(api.links.createLink, {
      title: "A2",
      url: "https://a2.example",
      note: "",
    });

    const aLinks = await userA.query(api.links.getAllLinks, {});
    expect(aLinks).toHaveLength(2);
    expect(aLinks.map((l) => l.title)).toEqual(["A2", "A1"]);
    expect(aLinks.every((l) => l.userId === "user_a")).toBe(true);
  });
});

describe("searchLinks", () => {
  test("returns [] for unauthenticated callers", async () => {
    const { t } = setup();
    const links = await t.query(api.links.searchLinks, { searchTerm: "x" });
    expect(links).toEqual([]);
  });

  test("returns all of the caller's links when searchTerm is empty", async () => {
    const { userA } = setup();
    await userA.mutation(api.links.createLink, {
      title: "One",
      url: "https://one.example",
      note: "",
    });
    await userA.mutation(api.links.createLink, {
      title: "Two",
      url: "https://two.example",
      note: "",
    });

    const links = await userA.query(api.links.searchLinks, { searchTerm: "" });
    expect(links).toHaveLength(2);
  });

  test("filters case-insensitively across title, url, and note", async () => {
    const { userA } = setup();
    await userA.mutation(api.links.createLink, {
      title: "React docs",
      url: "https://react.dev",
      note: "framework",
    });
    await userA.mutation(api.links.createLink, {
      title: "Vue docs",
      url: "https://vuejs.org",
      note: "another framework",
    });
    await userA.mutation(api.links.createLink, {
      title: "Random",
      url: "https://example.com",
      note: "REACT mention only here",
    });

    const byTitle = await userA.query(api.links.searchLinks, {
      searchTerm: "REACT",
    });
    expect(byTitle.map((l) => l.title).sort()).toEqual(["Random", "React docs"]);

    const byUrl = await userA.query(api.links.searchLinks, {
      searchTerm: "vuejs",
    });
    expect(byUrl).toHaveLength(1);
    expect(byUrl[0].title).toBe("Vue docs");

    const byNote = await userA.query(api.links.searchLinks, {
      searchTerm: "framework",
    });
    expect(byNote).toHaveLength(2);
  });

  test("never leaks results across users", async () => {
    const { userA, userB } = setup();
    await userA.mutation(api.links.createLink, {
      title: "secret-A",
      url: "https://a.example",
      note: "",
    });
    await userB.mutation(api.links.createLink, {
      title: "secret-B",
      url: "https://b.example",
      note: "",
    });

    const aResults = await userA.query(api.links.searchLinks, {
      searchTerm: "secret",
    });
    expect(aResults.map((l) => l.title)).toEqual(["secret-A"]);
  });
});

describe("deleteLink", () => {
  test("rejects unauthenticated callers", async () => {
    const { t, userA } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "x",
      url: "https://x.com",
      note: "",
    });
    await expect(t.mutation(api.links.deleteLink, { linkId })).rejects.toThrow(
      /unauthorized/i,
    );
  });

  test("rejects when the link belongs to another user", async () => {
    const { userA, userB } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "x",
      url: "https://x.com",
      note: "",
    });
    await expect(
      userB.mutation(api.links.deleteLink, { linkId }),
    ).rejects.toThrow(/not found/i);
  });

  test("deletes the link when the owner calls it", async () => {
    const { t, userA } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "x",
      url: "https://x.com",
      note: "",
    });
    await userA.mutation(api.links.deleteLink, { linkId });
    const after = await t.run(async (ctx) => ctx.db.get(linkId));
    expect(after).toBeNull();
  });
});

describe("updateLink", () => {
  test("rejects unauthenticated callers", async () => {
    const { t, userA } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "x",
      url: "https://x.com",
      note: "",
    });
    await expect(
      t.mutation(api.links.updateLink, {
        linkId,
        title: "y",
        url: "https://y.com",
        note: "",
      }),
    ).rejects.toThrow(/unauthorized/i);
  });

  test("rejects when the link belongs to another user", async () => {
    const { userA, userB } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "x",
      url: "https://x.com",
      note: "",
    });
    await expect(
      userB.mutation(api.links.updateLink, {
        linkId,
        title: "hijack",
        url: "https://h.com",
        note: "",
      }),
    ).rejects.toThrow(/not found/i);
  });

  test("patches title/url/note for the owner without touching other fields", async () => {
    const { t, userA } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "old",
      url: "https://old.example",
      note: "old note",
    });

    await userA.mutation(api.links.updateLink, {
      linkId,
      title: "new",
      url: "https://new.example",
      note: "new note",
    });

    const after = await t.run(async (ctx) => ctx.db.get(linkId));
    expect(after).toMatchObject({
      title: "new",
      url: "https://new.example",
      note: "new note",
      userId: "user_a",
    });
  });
});

describe("getLinkById", () => {
  test("returns null for unauthenticated callers", async () => {
    const { t, userA } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "x",
      url: "https://x.com",
      note: "",
    });
    const result = await t.query(api.links.getLinkById, { linkId });
    expect(result).toBeNull();
  });

  test("returns null when the link belongs to a different user", async () => {
    const { userA, userB } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "x",
      url: "https://x.com",
      note: "",
    });
    const result = await userB.query(api.links.getLinkById, { linkId });
    expect(result).toBeNull();
  });

  test("returns the doc when the owner queries it", async () => {
    const { userA } = setup();
    const linkId = await userA.mutation(api.links.createLink, {
      title: "MDN",
      url: "https://developer.mozilla.org",
      note: "docs",
    });
    const result = await userA.query(api.links.getLinkById, { linkId });
    expect(result).toMatchObject({
      _id: linkId,
      title: "MDN",
      url: "https://developer.mozilla.org",
      note: "docs",
      userId: "user_a",
    });
  });
});
