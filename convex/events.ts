import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    title: v.string(),
    amount: v.number(),
    date: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id("categories"),
    recurrence: v.optional(v.object({
      frequency: v.string(),
      endDate: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    if (args.recurrence) {
      const startDate = new Date(args.date);
      const endDate = args.recurrence.endDate ? new Date(args.recurrence.endDate) : new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1); // Default to 1 year if no end date

      const dates = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        
        switch (args.recurrence.frequency) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'yearly':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }
      }

      // Create an event for each date
      for (const date of dates) {
        await ctx.db.insert("events", {
          ...args,
          date: date.toISOString().split('T')[0],
          userId,
          enabled: true,
        });
      }
      return;
    }

    return await ctx.db.insert("events", {
      ...args,
      userId,
      enabled: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    date: v.optional(v.string()),
    title: v.optional(v.string()),
    amount: v.optional(v.number()),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    enabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const event = await ctx.db.get(args.id);
    if (!event || event.userId !== userId) throw new Error("Unauthorized");
    
    return await ctx.db.patch(args.id, {
      ...(args.date && { date: args.date }),
      ...(args.title && { title: args.title }),
      ...(args.amount && { amount: args.amount }),
      ...(args.description && { description: args.description }),
      ...(args.categoryId && { categoryId: args.categoryId }),
      ...(typeof args.enabled === 'boolean' && { enabled: args.enabled }),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const event = await ctx.db.get(args.id);
    if (!event || event.userId !== userId) throw new Error("Unauthorized");
    
    await ctx.db.delete(args.id);
  },
});

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("events")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId))
      .collect();
  },
});
