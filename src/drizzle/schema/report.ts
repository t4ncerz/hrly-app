import { relations } from "drizzle-orm";
import { pgTable, uuid, text, jsonb } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { ExaminationTable } from "./examination";

export type ReportContent = {
  title: string;
  executiveSummary: string;
  // Main report sections
  sections: {
    title: string;
    content?: string;
    subsections?: {
      title: string;
      content?: string;
      score?: number;
      strengths?: string[];
      improvements?: string[];
      recommendations?: string[];
    }[];
    prioritizedActions?: {
      action: string;
      priority: string;
      impact: string;
      timeline: string;
    }[];
    type?: string;
    order?: number;
  }[];
  metadata?: {
    reportType?: string;
    generatedAt?: string;
    version?: string;
    surveyName?: string;
    dateGenerated?: string;
    dataSource?: string;
    sampleSize?: string;
  };
};

// Report Table
export const ReportTable = pgTable("reports", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  examinationId: uuid()
    .references(() => ExaminationTable.id)
    .notNull(),

  // Report content with structured format for frontend consumption
  content: jsonb("content").$type<ReportContent>().notNull(),

  // Standard timestamps
  createdAt,
  updatedAt,
});

// Report relationships
export const ReportRelationships = relations(ReportTable, ({ one }) => ({
  examination: one(ExaminationTable, {
    fields: [ReportTable.examinationId],
    references: [ExaminationTable.id],
  }),
}));
