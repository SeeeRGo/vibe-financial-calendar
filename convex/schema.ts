import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  events: defineTable({
    title: v.string(),
    amount: v.number(),
    date: v.string(),
    type: v.string(), // "income" or "expense"
    userId: v.id("users"),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    enabled: v.optional(v.boolean()),
    recurrence: v.optional(v.object({
      frequency: v.string(),
      endDate: v.optional(v.string()),
    })),
  }).index("by_user_and_date", ["userId", "date"])
    .index("by_category_and_date", ["categoryId", "date"]),

  categories: defineTable({
    name: v.string(),
    type: v.string(), // "income" or "expense"
    userId: v.id("users"),
    parentId: v.optional(v.id("categories")),
    spendingCap: v.optional(v.object({
      amount: v.number(),
      period: v.string(), // "daily", "weekly", "monthly", "yearly"
    })),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
