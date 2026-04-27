import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnsLink, getOptionalUser, requireUser } from "./utils";

export const createLink = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireUser(ctx);
    return await ctx.db.insert("links", {
      userId: identity.subject,
      title: args.title,
      url: args.url,
      note: args.note,
      createdAt: Date.now(),
    });
  },
});

export const getAllLinks = query({
  handler: async (ctx) => {
    const identity = await getOptionalUser(ctx);
    if (!identity) {
      return [];
    }
    return await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const searchLinks = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getOptionalUser(ctx);
    if (!identity) {
      return [];
    }
    const allLinks = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
    const term = args.searchTerm.trim().toLowerCase();
    if (!term) {
      return allLinks;
    }
    return allLinks.filter(
      (link) =>
        link.title.toLowerCase().includes(term) ||
        link.url.toLowerCase().includes(term) ||
        link.note.toLowerCase().includes(term),
    );
  },
});

export const deleteLink = mutation({
  args: {
    linkId: v.id("links"),
  },
  handler: async (ctx, args) => {
    const identity = await requireUser(ctx);
    await assertOwnsLink(ctx, args.linkId, identity.subject);
    await ctx.db.delete(args.linkId);
  },
});

export const updateLink = mutation({
  args: {
    linkId: v.id("links"),
    title: v.string(),
    url: v.string(),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireUser(ctx);
    await assertOwnsLink(ctx, args.linkId, identity.subject);
    await ctx.db.patch(args.linkId, {
      title: args.title,
      url: args.url,
      note: args.note,
    });
  },
});

export const getLinkById = query({
  args: {
    linkId: v.id("links"),
  },
  handler: async (ctx, args) => {
    const identity = await getOptionalUser(ctx);
    if (!identity) {
      return null;
    }
    const link = await ctx.db.get(args.linkId);
    if (!link || link.userId !== identity.subject) {
      return null;
    }
    return link;
  },
});
