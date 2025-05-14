import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    parentId: v.optional(v.id("categories")),
    spendingCap: v.optional(v.object({
      amount: v.number(),
      period: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db.insert("categories", {
      ...args,
      userId,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    parentId: v.optional(v.id("categories")),
    spendingCap: v.optional(v.object({
      amount: v.number(),
      period: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId) throw new Error("Unauthorized");
    
    return await ctx.db.patch(args.id, {
      name: args.name,
      parentId: args.parentId,
      spendingCap: args.spendingCap,
    });
  },
});

export const getRemainingBalance = query({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== userId) throw new Error("Unauthorized");
    if (!category.spendingCap) return null;

    const now = new Date();
    let startDate = new Date(now);
    
    switch (category.spendingCap.period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'yearly':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    const expenses = await ctx.db
      .query("events")
      .withIndex("by_category_and_date", (q) => 
        q.eq("categoryId", args.categoryId)
         .gte("date", startDate.toISOString().split('T')[0])
      )
      .collect();

    const spent = expenses
      .filter(event => event.enabled !== false) // Consider event enabled if field is missing
      .reduce((sum, event) => sum + event.amount, 0);
      
    return {
      cap: category.spendingCap.amount,
      spent,
      remaining: category.spendingCap.amount - spent,
    };
  },
});

export const getProjectedBalance = query({
  args: {
    categoryId: v.id("categories"),
    targetDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== userId) throw new Error("Unauthorized");
    if (!category.spendingCap) return null;

    const targetDateObj = new Date(args.targetDate);
    let startDate = new Date(targetDateObj);
    
    switch (category.spendingCap.period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(targetDateObj.getDate() - targetDateObj.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'yearly':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    const expenses = await ctx.db
      .query("events")
      .withIndex("by_category_and_date", (q) => 
        q.eq("categoryId", args.categoryId)
         .gte("date", startDate.toISOString().split('T')[0])
         .lte("date", args.targetDate)
      )
      .collect();

    const projected = expenses
      .filter(event => event.enabled !== false) // Consider event enabled if field is missing
      .reduce((sum, event) => sum + event.amount, 0);
      
    return {
      cap: category.spendingCap.amount,
      projected,
      remaining: category.spendingCap.amount - projected,
    };
  },
});
