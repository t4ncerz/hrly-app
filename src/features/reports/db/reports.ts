import { eq } from "drizzle-orm";
import {
  ExaminationTable,
  ReportTable,
  type Report,
  type NewReport,
} from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { generateReport } from "@/services/gemini/gemini-service";

export async function insertReport(
  examinationId: string,
  metadataForReport: {
    id: string;
    name: string;
    description?: string;
  }
): Promise<Report> {
  console.log("🔍 Looking for examination with ID:", examinationId);

  const [examination] = await db
    .select()
    .from(ExaminationTable)
    .where(eq(ExaminationTable.id, examinationId));

  if (!examination) {
    throw new Error("Failed to create report: Examination not found");
  }

  console.log("✅ Found examination:", {
    id: examination.id,
    sourceDataExists: !!examination.sourceData,
    sourceDataLength: examination.sourceData
      ? examination.sourceData.toString().length
      : 0,
  });

  const content = await generateReport([examination]);

  const data: NewReport = {
    id: metadataForReport.id,
    name: metadataForReport.name,
    examinationId,
    content,
  };

  const [newReport] = await db.insert(ReportTable).values(data).returning();

  if (!newReport) {
    throw new Error("Failed to create report");
  }

  return newReport;
}

export async function getReport(id: string): Promise<Report | null> {
  const [report] = await db
    .select()
    .from(ReportTable)
    .where(eq(ReportTable.id, id));

  return report || null;
}
