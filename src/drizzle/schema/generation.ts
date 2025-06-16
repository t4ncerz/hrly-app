import { relations } from "drizzle-orm";
import { pgTable, uuid, jsonb } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { ExaminationTable } from "./examination";

export type GenerationContent = {
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

// Generation Table
export const GenerationTable = pgTable("generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  examinationId: uuid("examination_id")
    .references(() => ExaminationTable.id)
    .notNull(),

  // Report content with structured format for frontend consumption
  content: jsonb("content").$type<GenerationContent>().notNull(),

  // Standard timestamps
  createdAt,
  updatedAt,
});

// Report relationships
export const GenerationRelationships = relations(
  GenerationTable,
  ({ one }) => ({
    examination: one(ExaminationTable, {
      fields: [GenerationTable.examinationId],
      references: [ExaminationTable.id],
    }),
  })
);
