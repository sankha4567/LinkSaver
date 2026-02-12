import {defineSchema,defineTable} from 'convex/server'
import {v} from "convex/values";

export default defineSchema({
  links:defineTable({
    userId:v.string(),
    title:v.string(),
    url:v.string(),
    note:v.string(),
    createdAt:v.number(),
  }).index("by_user",["userId"])
  .index("by_created_at",["createdAt"])
});