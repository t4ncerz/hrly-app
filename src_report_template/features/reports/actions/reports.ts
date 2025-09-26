"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
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
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    const envBase = process.env.NEXT_PUBLIC_BASE_URL;
    const vercelUrl = process.env.VERCEL_URL;
    const baseUrl =
      envBase ||
      (host
        ? `${proto}://${host}`
        : vercelUrl
        ? `https://${vercelUrl}`
        : undefined);

    const report = await insertReport(
      examinationId,
      {
        id: randomUUID(),
        name,
        description,
      },
      { baseUrl }
    );

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
