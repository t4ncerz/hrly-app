import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { GenerationTable } from "./generation";

export const examinationTypeEnum = ["ENGAGEMENT"] as const;

export const ExaminationTable = pgTable("examinations", {
  id: uuid().primaryKey(),
  userId: varchar("user_id").notNull(),
  name: text().notNull(),
  description: text(),
  type: text().$type<(typeof examinationTypeEnum)[number]>().notNull(),
  sourceFileUrl: text(),

  // Metadata for examination
  extractedData: jsonb("extracted_data"),
  status: text().default("PENDING").notNull(),
  startDate: timestamp(),
  endDate: timestamp(),
  respondentsCount: text().default("0"),

  // Timestamps
  createdAt,
  updatedAt,
});

export const ExaminationRelationships = relations(
  ExaminationTable,
  ({ many }) => ({
    // An examination can have many reports
    generations: many(GenerationTable),
  })
);
