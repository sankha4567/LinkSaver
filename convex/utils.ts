import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

export async function requireUser(ctx: Ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  return identity;
}

export async function getOptionalUser(ctx: Ctx) {
  return ctx.auth.getUserIdentity();
}

export async function assertOwnsLink(
  ctx: Ctx,
  linkId: Id<"links">,
  userId: string,
): Promise<Doc<"links">> {
  const link = await ctx.db.get(linkId);
  if (!link || link.userId !== userId) {
    throw new Error("Not found");
  }
  return link;
}
