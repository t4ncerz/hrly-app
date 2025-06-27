import { relations } from "drizzle-orm";
import { pgTable, uuid, text, jsonb } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { ExaminationTable } from "./examination";

export const ReportTable = pgTable("reports", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  examinationId: uuid()
    .references(() => ExaminationTable.id)
    .notNull(),

  // Report content with new structured format for frontend consumption
  content: jsonb("content").$type<ReportContent>().notNull(),

  // Standard timestamps
  createdAt,
  updatedAt,
});

export type ReportContent = {
  title_page: {
    company_name: string;
    report_title: string;
  };
  table_of_contents: {
    title: string;
    items: string[];
  };
  overall_analysis: {
    engagement: {
      overall_score: number;
      title: string;
      main_description: string;
      attitude_points: string[];
      duties_points: string[];
      loyalty_points: string[];
      businessImpact: string;
    };
    satisfaction: {
      overall_score: number;
      title: string;
      main_description: string;
      attitude_points: string[];
      duties_points: string[];
      loyalty_points: string[];
      businessImpact: string;
    };
    top_scores: {
      lowest: {
        title: string;
        data: Array<{
          area: string;
          average: number;
          range: string;
        }>;
        insight: string;
      };
      highest: {
        title: string;
        data: Array<{
          area: string;
          average: number;
          range: string;
        }>;
        insight: string;
      };
    };
  };
  detailed_areas: Array<{
    area_name: string;
    company_summary: {
      title: string;
      overall_average_text: string;
      sub_areas_breakdown: Array<{
        name: string;
        value: string;
        score: string;
      }>;
      key_findings_header: string;
      key_findings_points: string[];
      summary_header: string;
      summary_paragraph: string;
    };
    team_breakdown: {
      title: string;
      table_headers: string[];
      data: Array<{
        [key: string]: string | string[];
      }>;
    };
    organizational_recommendations: {
      title: string;
      recommendation_blocks: Array<{
        title: string;
        points: string[];
      }>;
    };
    business_impact: {
      title: string;
      points: string[];
    };
  }>;
  leader_guidelines: Array<{
    department: string;
    start: string[];
    stop: string[];
    continue: string[];
    welcome: string[];
  }>;
};

export type Report = typeof ReportTable.$inferSelect;
export type NewReport = typeof ReportTable.$inferInsert;

// Report relationships
export const ReportRelationships = relations(ReportTable, ({ one }) => ({
  examination: one(ExaminationTable, {
    fields: [ReportTable.examinationId],
    references: [ExaminationTable.id],
  }),
}));
