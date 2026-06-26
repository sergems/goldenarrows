import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const AD_SLOTS = [
  "fixtures-left",
  "fixtures-right",
  "results-left",
  "results-right",
  "table-left",
  "table-right",
] as const;

export type AdSlot = (typeof AD_SLOTS)[number];

export const adsTable = pgTable("ads", {
  id: serial("id").primaryKey(),
  slot: text("slot").notNull().unique(),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  altText: text("alt_text"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Ad = typeof adsTable.$inferSelect;
