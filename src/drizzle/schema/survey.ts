import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { ExaminationTable, examinationTypeEnum } from "./examination";
import { relations } from "drizzle-orm";

export const surveyTemplates = pgTable("survey_templates", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  description: text(),
  type: text().$type<(typeof examinationTypeEnum)[number]>().notNull(),
  questions: jsonb(),
  createdAt,
  updatedAt,
});

export const surveyDistributionMethodEnum = ["EMAIL", "LINK"] as const;

export const surveyDistributions = pgTable("survey_distributions", {
  id: uuid().primaryKey(),
  examinationId: uuid().references(() => ExaminationTable.id),
  method: text()
    .$type<(typeof surveyDistributionMethodEnum)[number]>()
    .notNull(),
  recipientsList: jsonb(),
  accessCode: text(),
  expiryDate: timestamp(),
  createdAt,
  updatedAt,
});

export const surveyResponse = pgTable("survey_responses", {
  id: uuid().primaryKey(),
  distributionId: uuid().references(() => surveyDistributions.id),
  responseData: jsonb(),
  createdAt,
  updatedAt,
});

export const surveyResponseRelationships = relations(
  surveyResponse,
  ({ one }) => ({
    distribution: one(surveyDistributions, {
      fields: [surveyResponse.distributionId],
      references: [surveyDistributions.id],
    }),
  })
);
