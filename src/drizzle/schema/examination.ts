import { relations } from "drizzle-orm";
import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { ReportTable } from "./report";

export const examinationTypeEnum = ["ENGAGEMENT"] as const;

export const ExaminationTable = pgTable("examinations", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  description: text(),
  type: text().$type<(typeof examinationTypeEnum)[number]>().notNull(),

  // Metadata for examination
  sourceData: jsonb(),
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
    reports: many(ReportTable),
  })
);
