import { ExaminationTable, ReportTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { generateReport } from "@/services/gemini/gemini-service";

export async function insertReport(
  examinationId: string,
  metadataForReport: Omit<
    typeof ReportTable.$inferInsert,
    "examinationId" | "content" | "status"
  >
) {
  const [examination] = await db
    .select()
    .from(ExaminationTable)
    .where(eq(ExaminationTable.id, examinationId));

  if (!examination) {
    throw new Error("Failed to create report: Examination not found");
  }

  const content = await generateReport([examination]);

  const data = {
    ...metadataForReport,
    examinationId,
    content,
  };
  const [newReport] = await db.insert(ReportTable).values(data).returning();

  if (!newReport) {
    throw new Error("Failed to create report");
  }

  return newReport;
}

export async function getReport(id: string) {
  const [report] = await db
    .select()
    .from(ReportTable)
    .where(eq(ReportTable.id, id));

  if (!report) {
    return null;
  }

  return report;
}
