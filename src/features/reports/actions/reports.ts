"use server";

import { randomUUID } from "crypto";
import { insertReport, getReport as getReportFromDb } from "../db/reports";

export async function createReport({
  examinationId,
  name,
  description,
}: {
  examinationId: string;
  name: string;
  description?: string;
}) {
  try {
    const report = await insertReport(examinationId, {
      id: randomUUID(),
      name,
      description,
    });

    return report;
  } catch (error) {
    console.error("Error creating report:", error);
    throw new Error(
      `Failed to create report: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function getReport(id: string) {
  const report = await getReportFromDb(id);
  return report;
}
